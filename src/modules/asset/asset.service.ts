import {
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository, Transaction, TransactionRepository } from 'typeorm';
import { hammingDistance, pHash, sha1 } from '@powerfulyang/node-utils';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { basename, extname, join } from 'path';
import fetch from 'node-fetch';
import sharp from 'sharp';
import { PixivBotService } from 'api/pixiv-bot';
import { InstagramBotService } from 'api/instagram-bot';
import { PinterestBotService } from 'api/pinterest-bot';
import { ProxyFetchService } from 'api/proxy-fetch';
import type { PinterestInterface } from 'api/pinterest-bot/pinterest.interface';
import { SUCCESS } from '@/constants/constants';
import { CoreService } from '@/core/core.service';
import type { UploadFile, UploadFileMsg } from '@/type/UploadFile';
import type { Pagination } from '@/common/decorator/pagination.decorator';
import { Asset } from '@/modules/asset/entities/asset.entity';
import type { User } from '@/modules/user/entities/user.entity';
import { getEXIF } from '../../../addon.api';
import { CosBucket } from '@/modules/bucket/entities/bucket.entity';
import { AppLogger } from '@/common/logger/app.logger';
import { UploadAssetService } from '@/microservice/handleAsset/upload-asset.service';
import { ScheduleType } from '@/enum/ScheduleType';
import { TencentCloudAccountService } from '@/modules/tencent-cloud-account/tencent-cloud-account.service';
import { UserService } from '@/modules/user/user.service';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset) private readonly assetDao: Repository<Asset>,
    @InjectRepository(CosBucket) private readonly bucketDao: Repository<CosBucket>,
    private readonly coreService: CoreService,
    private readonly pixivBotService: PixivBotService,
    private readonly instagramBotService: InstagramBotService,
    private readonly pinterestBotService: PinterestBotService,
    private readonly logger: AppLogger,
    private readonly proxyFetchService: ProxyFetchService,
    private readonly uploadStaticService: UploadAssetService,
    private readonly tencentCloudAccountService: TencentCloudAccountService,
    private readonly userService: UserService,
  ) {
    this.logger.setContext(AssetService.name);
  }

  async getAssets(pagination: Pagination, ids: User['id'][] = []) {
    const BotUser = await this.userService.getAssetBotUser();
    return this.assetDao.findAndCount({
      ...pagination,
      order: { id: 'DESC' },
      where: [
        {
          uploadBy: In(ids.concat(BotUser.id)),
        },
      ],
    });
  }

  all() {
    return this.assetDao.find();
  }

  async pHashMap() {
    const assets = await this.assetDao.find({
      select: ['id', 'pHash'],
    });
    const distanceMap = new Map();
    for (;;) {
      const next = assets.pop();
      if (next) {
        assets.forEach((asset) => {
          const distance = hammingDistance(asset.pHash, next.pHash);
          if (distance <= 10) {
            const arr = distanceMap.get(asset.id) || [];
            if (arr[distance]) {
              arr[distance].push(next.id);
            } else {
              arr[distance] = [next.id];
            }
            distanceMap.set(asset.id, arr);
            const arr2 = distanceMap.get(next.id) || [];
            if (arr2[distance]) {
              arr2[distance].push(asset.id);
            } else {
              arr2[distance] = [asset.id];
            }
            distanceMap.set(asset.id, arr);
            distanceMap.set(next.id, arr2);
          }
        });
      } else {
        break;
      }
    }
    const obj = {} as any;
    distanceMap.forEach((val, key) => {
      obj[key] = val;
    });
    return obj;
  }

  async saveAssetToBucket(files: UploadFile[], bucketName: CosBucket['name'], uploadBy: User) {
    const assets: Asset[] = [];
    for (const file of files) {
      const asset = await this.manualUpload(file.buffer, bucketName);
      await this.assetDao.update(asset.id, {
        uploadBy,
      });
      assets.push(asset);
    }
    return assets;
  }

  /**
   * 批量删除 asset
   * @param ids
   * @param assetRepository
   */
  @Transaction()
  async deleteAsset(
    ids: number[],
    @TransactionRepository(Asset) assetRepository?: Repository<Asset>,
  ) {
    for (const id of ids) {
      const asset = await assetRepository!.findOneOrFail(id);
      const util = await this.tencentCloudAccountService.getCosUtilByAccountId(
        asset.bucket.tencentCloudAccount.id,
      );
      const res = await util.deleteObject({
        Key: `${asset.sha1}${asset.fileSuffix}`,
        Bucket: asset.bucket.Bucket,
        Region: asset.bucket.Region,
      });
      await assetRepository!.delete(id);
      if (res.statusCode !== HttpStatus.NO_CONTENT) {
        throw new ServiceUnavailableException(`删除cos源文件失败, 数据库回滚`);
      }
    }
    return SUCCESS;
  }

  async randomAsset() {
    return this.assetDao.createQueryBuilder().orderBy('random()').limit(1).getOneOrFail();
  }

  async getCosUrl(Key: string, bucket: CosBucket) {
    const util = await this.tencentCloudAccountService.getCosUtilByAccountId(
      bucket.tencentCloudAccount.id,
    );
    const { Bucket, Region } = bucket;
    const { Url: cosUrl } = await util.getObjectUrl({
      Sign: false,
      Key,
      Bucket,
      Region,
    });
    return cosUrl;
  }

  async getObjectUrl(Key: string, bucket: CosBucket) {
    const util = await this.tencentCloudAccountService.getCosUtilByAccountId(
      bucket.tencentCloudAccount.id,
    );
    const { Bucket, Region } = bucket;
    const { Url: objectUrl } = await util.getObjectUrl({
      Key,
      Bucket,
      Region,
      Expires: 60 * 60 * 24, // 1day
    });
    return objectUrl;
  }

  async syncFromCos() {
    const buckets = await this.bucketDao.find();
    for (const bucket of buckets) {
      const util = await this.tencentCloudAccountService.getCosUtilByAccountId(
        bucket.tencentCloudAccount.id,
      );
      const objects = await util.getBucket(bucket);
      for (const object of objects.Contents) {
        const fileExtname = extname(object.Key);
        const hash = basename(object.Key, fileExtname);
        const fileSuffix = fileExtname.substr(1);
        const asset = await this.assetDao.findOne({ sha1: hash });
        // asset 不存在
        if (!asset) {
          const cosUrl = await this.getCosUrl(object.Key, bucket);
          const objectUrl = await this.getObjectUrl(object.Key, bucket);
          const path = join(process.cwd(), 'assets', `${hash}.${fileSuffix}`);
          const exist = existsSync(path);
          if (!exist) {
            // 需要下载下来
            const res = await fetch(objectUrl);
            const buffer = await res.buffer();
            writeFileSync(path, buffer);
          }
          const buffer = readFileSync(path);
          // 读取元信息
          const exif = getEXIF(path);
          const metadata = await sharp(path).metadata();
          const phash = await pHash(buffer);
          const newAsset = this.assetDao.create({
            cosUrl,
            sha1: hash,
            objectUrl,
            fileSuffix,
            pHash: phash,
            exif,
            metadata,
            bucket,
            uploadBy: await this.userService.getAssetBotUser(),
          });
          await this.assetDao.save(newAsset);
        }
      }
    }
    return SUCCESS;
  }

  async getAssetById(id: Asset['id'], ids: User['id'][] = []) {
    const BotUser = await this.userService.getAssetBotUser();
    return this.assetDao.findOneOrFail({
      where: [
        {
          id,
          uploadBy: In(ids.concat(BotUser.id)),
        },
      ],
      relations: ['uploadBy'],
    });
  }

  async fetchImgBuffer(imgUrl: string, headers: any) {
    let res = await this.proxyFetchService.proxyFetch(imgUrl, {
      headers,
    });
    this.logger.info(`fetch img status code -> ${res.status}`);
    if (res.status !== HttpStatus.OK) {
      const newUrl = imgUrl.replace(/(jpg)$/, 'png');
      res = await this.proxyFetchService.proxyFetch(newUrl, { headers });
      this.logger.info(`fetch img status code -> ${res.status}`);
      if (res.status !== HttpStatus.OK) {
        throw new Error('get img deny!');
      }
    }
    return res;
  }

  /**
   * 手动上传图片
   * @param buffer
   * @param bucketName
   */
  async manualUpload(buffer: Buffer, bucketName: CosBucket['name']) {
    let asset = this.assetDao.create();
    asset.bucket = await this.bucketDao.findOneOrFail({
      name: bucketName,
    });
    asset.sha1 = sha1(buffer);
    const s = sharp(buffer);
    const metadata = await s.metadata();
    if (!metadata.format) {
      throw new UnsupportedMediaTypeException();
    }
    asset.fileSuffix = metadata.format;
    asset.pHash = await pHash(buffer);
    try {
      const path = join(process.cwd(), 'assets', `${asset.sha1}.${asset.fileSuffix}`);
      asset.exif = getEXIF(path);
      asset.metadata = metadata;
      asset = await this.assetDao.save(asset);
      writeFileSync(path, buffer);
      const data: UploadFileMsg = {
        sha1: asset.sha1,
        suffix: asset.fileSuffix,
        name: asset.bucket.name,
      };
      await this.uploadStaticService.persistent(data);
    } catch (e) {
      this.logger.error(e);
    }
    return asset;
  }

  /**
   * bot 定时 下载图片
   * @param bucketName
   */
  async assetBotSchedule(bucketName: CosBucket['name']) {
    const bucket = await this.bucketDao.findOneOrFail({
      name: bucketName,
    });
    const max = await this.assetDao.findOne({
      order: { id: 'DESC' },
      where: {
        bucket,
        sn: Not(''),
      },
    });
    let undoes: PinterestInterface[] = [];
    const headers = { refer: '' };
    switch (bucketName) {
      case ScheduleType.instagram:
        undoes = await this.instagramBotService.fetchUndo(max?.sn);
        break;
      case ScheduleType.pinterest:
        undoes = await this.pinterestBotService.fetchUndo(max?.sn);
        headers.refer = 'https://www.pinterest.com/';
        break;
      case ScheduleType.pixiv:
        undoes = await this.pixivBotService.fetchUndo(max?.sn);
        break;
      default:
        throw new UnprocessableEntityException();
    }
    this.logger.info(`undoes count -> ${undoes.length}`);
    for (const undo of undoes.reverse()) {
      this.logger.debug(`[${bucketName}] -> ${undo.id} -> ${undo.imgList}`);
      for (const imgUrl of undo.imgList) {
        let asset = this.assetDao.create();
        asset.sn = undo.id;
        asset.originUrl = undo.originUrl;
        asset.tags = undo.tags;
        // ε=(´ο｀*))) 专属的脚本机器人
        asset.uploadBy = await this.userService.getAssetBotUser();
        try {
          const res = await this.fetchImgBuffer(imgUrl, headers);
          const buffer = await res.buffer();
          const metadata = await sharp(buffer).metadata();
          asset.sha1 = sha1(buffer);
          if (metadata.format) {
            asset.fileSuffix = metadata.format;
            asset.pHash = await pHash(buffer);
            const path = join(process.cwd(), 'assets', `${asset.sha1}.${asset.fileSuffix}`);
            asset.exif = getEXIF(path);
            asset.metadata = metadata;
            asset.bucket = bucket;
            this.logger.info(`bucket => ${JSON.stringify(asset.bucket)}`);
            asset = await this.assetDao.save(asset);
            writeFileSync(path, buffer);
            this.coreService.notifyCos({
              sha1: asset.sha1,
              suffix: asset.fileSuffix,
              name: bucket.name,
            });
          }
        } catch (e) {
          this.logger.error('fetchImgBuffer error', e);
        }
      }
    }
  }

  updateAssetObjectUrl(id: number, objectUrl: string) {
    return this.assetDao.update(id, { objectUrl });
  }
}
