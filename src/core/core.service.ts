import { HttpStatus, Inject, Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { COS_UPLOAD_MSG_PATTERN, MICROSERVICE_NAME, Region } from '@/constants/constants';
import { ClientProxy } from '@nestjs/microservices';
import { AssetBucket } from '@/enum/AssetBucket';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { AppLogger } from '@/common/logger/app.logger';
import { PixivBotService } from 'api/pixiv-bot';
import { ProxyFetchService } from 'api/proxy-fetch';
import { pHash, sha1 } from '@powerfulyang/node-utils';
import { __prod__ } from '@powerfulyang/utils';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InstagramBotService } from 'api/instagram-bot';
import { PinterestRssService } from 'api/pinterest-rss';
import { PinterestInterface } from 'api/pinterest-rss/pinterest.interface';
import { Bucket } from '@/modules/bucket/entities/bucket.entity';
import { TencentCloudCosService } from 'api/tencent-cloud-cos';
import { CacheService } from '@/core/cache/cache.service';
import { COMMON_CODE_UUID } from '@/utils/uuid';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';
import { UploadAssetService } from '@/microservice/handleAsset/upload-asset.service';
import sharp from 'sharp';
import { getEnumKeys } from '@/utils/getClassStaticProperties';

@Injectable()
export class CoreService {
  constructor(
    @Inject(MICROSERVICE_NAME)
    readonly microserviceClient: ClientProxy,
    private logger: AppLogger,
    private pixivBotService: PixivBotService,
    private instagramBotService: InstagramBotService,
    private pinterestRssService: PinterestRssService,
    @InjectRepository(Asset)
    private assetDao: Repository<Asset>,
    @InjectRepository(Bucket)
    private bucketDao: Repository<Bucket>,
    private proxyFetchService: ProxyFetchService,
    private tencentCloudCosService: TencentCloudCosService,
    private cacheService: CacheService,
    private readonly uploadStaticService: UploadAssetService,
  ) {
    this.logger.setContext(CoreService.name);
    this.setCommonNodeUuid().then((uuid) => {
      this.logger.info(`node uuid => ${uuid}`);
    });
  }

  async setCommonNodeUuid() {
    this.logger.info(`当前环境====>${process.env.NODE_ENV}`);
    await this.cacheService.set(REDIS_KEYS.COMMON_NODE, COMMON_CODE_UUID);
    return COMMON_CODE_UUID;
  }

  getCommonNodeUuid() {
    return this.cacheService.get(REDIS_KEYS.COMMON_NODE);
  }

  async isCommonNode() {
    const uuid = await this.getCommonNodeUuid();
    return uuid === COMMON_CODE_UUID;
  }

  async isProdCommonNode() {
    const bool = await this.isCommonNode();
    return bool && __prod__;
  }

  notifyCos(notification: { sha1: string; suffix: string; bucketName: AssetBucket }) {
    return this.microserviceClient.emit(COS_UPLOAD_MSG_PATTERN, notification);
  }

  async initBucket() {
    for (const bucket of getEnumKeys(AssetBucket)) {
      let res: any;
      try {
        res = await this.tencentCloudCosService.headBucket({
          Bucket: bucket,
          Region,
        });
      } catch (e) {
        this.logger.info(`headBucket error code is [${e.name}]`);
        res = e;
      }
      if (res.statusCode !== HttpStatus.OK) {
        try {
          await this.tencentCloudCosService.putBucket({
            Bucket: bucket,
            Region,
          });
        } catch (e) {
          this.logger.error('putBucket', e);
        }
      }
      const bucketEntity = await this.bucketDao.findOne({
        bucketName: bucket as AssetBucket,
        bucketRegion: Region,
      });
      if (!bucketEntity) {
        await this.bucketDao.insert({
          bucketName: bucket as AssetBucket,
          bucketRegion: Region,
        });
      }
    }
  }

  getBotBucket(bucketName: AssetBucket) {
    return this.bucketDao.findOneOrFail({
      bucketName,
      bucketRegion: Region,
    });
  }

  async fetchImgBuffer(imgUrl: string, headers: any) {
    let count = 0;
    let res = await this.proxyFetchService.proxyFetch(imgUrl, {
      headers,
    });
    this.logger.info(`fetch img status code -> ${res.status}`);
    if (res.status !== HttpStatus.OK) {
      count++;
      if (count >= 2) {
        throw new Error('get img deny!');
      }
      const newUrl = imgUrl.replace(/(jpg)$/, 'png');
      res = await this.fetchImgBuffer(newUrl, headers);
    }
    return res;
  }

  async initManualUpload(
    buffer: Buffer,
    async: boolean = true,
    bucketName: AssetBucket = AssetBucket.upload,
  ) {
    let asset = new Asset();
    asset.bucket = await this.getBotBucket(bucketName);
    asset.sha1 = sha1(buffer);
    const s = sharp(buffer);
    const { format } = await s.metadata();
    if (!format) {
      throw new UnsupportedMediaTypeException();
    }

    asset.fileSuffix = format;
    asset.pHash = await pHash(buffer);

    try {
      await this.assetDao.insert(asset);
      const data = {
        sha1: asset.sha1,
        suffix: asset.fileSuffix,
        bucketName: asset.bucket.bucketName,
      };
      writeFileSync(join(process.cwd(), 'assets', `${asset.sha1}.${asset.fileSuffix}`), buffer);
      if (async) {
        this.notifyCos(data);
      } else {
        await this.uploadStaticService.persistent(data);
      }
    } catch (e) {
      // duplicate entry
      this.logger.error(e);
    }

    asset = await this.assetDao.findOneOrFail({
      sha1: asset.sha1,
    });
    return asset;
  }

  async botBaseService(bucketName: AssetBucket) {
    const bucket = await this.bucketDao.findOne({
      bucketName,
      bucketRegion: Region,
    });
    const max = await this.assetDao.findOne({
      order: { id: 'DESC' },
      where: {
        bucket,
      },
    });
    let undoes: PinterestInterface[] = [];
    const headers = { refer: '' };
    switch (bucketName) {
      case AssetBucket.instagram:
        undoes = await this.instagramBotService.fetchUndo(max?.sn);
        break;
      case AssetBucket.pinterest:
        undoes = await this.pinterestRssService.fetchUndo(max?.sn);
        headers.refer = 'https://www.pinterest.com/';
        break;
      case AssetBucket.pixiv:
        undoes = await this.pixivBotService.fetchUndo(max?.sn);
        break;
      default:
    }
    this.logger.info(`undoes count -> ${undoes.length}`);
    for (const undo of undoes.reverse()) {
      this.logger.debug(`[${bucketName}] -> ${undo.id} -> ${undo.imgList}`);
      for (const imgUrl of undo.imgList) {
        const asset = new Asset();
        asset.sn = undo.id;
        asset.originUrl = undo.originUrl;
        asset.tags = undo.tags;
        try {
          const res = await this.fetchImgBuffer(imgUrl, headers);
          const buffer = await res.buffer();
          const s = await sharp(buffer).metadata();
          asset.sha1 = sha1(buffer);
          if (!s.format) {
            throw new UnsupportedMediaTypeException();
          }
          asset.fileSuffix = s.format;
          asset.pHash = await pHash(buffer);
          writeFileSync(join(process.cwd(), 'assets', `${asset.sha1}.${asset.fileSuffix}`), buffer);
          asset.bucket = await this.getBotBucket(bucketName);
          this.logger.info(`bucket => ${JSON.stringify(asset.bucket)}`);
          try {
            await this.assetDao.insert(asset);
            this.notifyCos({
              sha1: asset.sha1,
              suffix: asset.fileSuffix,
              bucketName,
            });
          } catch (e) {
            this.logger.error(e);
          }
        } catch (e) {
          this.logger.error('fetchImgBuffer error', e);
        }
      }
    }
  }
}
