import {
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, LessThan, Not, Repository } from 'typeorm';
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
import { isNotNull, isNull, lastItem } from '@powerfulyang/utils';
import { SUCCESS } from '@/constants/constants';
import { CoreService } from '@/core/core.service';
import type { UploadFile, UploadFileMsg } from '@/type/UploadFile';
import type { Pagination } from '@/common/decorator/pagination.decorator';
import { Asset } from '@/modules/asset/entities/asset.entity';
import type { User } from '@/modules/user/entities/user.entity';
import { getEXIF } from '../../../addon.api';
import type { CosBucket } from '@/modules/bucket/entities/bucket.entity';
import { AppLogger } from '@/common/logger/app.logger';
import { UploadAssetService } from '@/microservice/handleAsset/upload-asset.service';
import { ScheduleType } from '@/enum/ScheduleType';
import { TencentCloudAccountService } from '@/modules/tencent-cloud-account/tencent-cloud-account.service';
import { UserService } from '@/modules/user/user.service';
import type { InfiniteQueryResponse } from '@/type/InfiniteQuery';
import { BucketService } from '@/modules/bucket/bucket.service';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset) private readonly assetDao: Repository<Asset>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly coreService: CoreService,
    private readonly pixivBotService: PixivBotService,
    private readonly instagramBotService: InstagramBotService,
    private readonly pinterestBotService: PinterestBotService,
    private readonly logger: AppLogger,
    private readonly proxyFetchService: ProxyFetchService,
    private readonly uploadStaticService: UploadAssetService,
    private readonly tencentCloudAccountService: TencentCloudAccountService,
    private readonly userService: UserService,
    private readonly bucketService: BucketService,
  ) {
    this.logger.setContext(AssetService.name);
  }

  async publicAssetSource() {
    const publicBuckets = await this.bucketService.listPublicBucket();
    const publicUsers = await this.userService.listAssetPublicUser();
    return {
      publicBucketIds: publicBuckets.map((bucket) => bucket.id),
      publicUserIds: publicUsers.map((user) => user.id),
    };
  }

  // 获取有权限的资源
  async getAssets(pagination: Partial<Pagination> = {}, ids: User['id'][] = []) {
    const publicAssetSource = await this.publicAssetSource();
    return this.assetDao.findAndCount({
      ...pagination,
      order: { id: 'DESC' },
      where: [
        {
          uploadBy: {
            id: In([...ids, ...publicAssetSource.publicUserIds]),
          },
          bucket: {
            id: In(publicAssetSource.publicBucketIds),
          },
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
      const asset = await this.manualUpload(file.buffer, bucketName, uploadBy);
      assets.push(asset);
    }
    return assets;
  }

  /**
   * 批量删除 asset
   * @param ids
   */
  async deleteAsset(ids: number[]) {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      for (const id of ids) {
        const asset = await transactionalEntityManager.findOneByOrFail(Asset, {
          id,
        });
        const util = await this.tencentCloudAccountService.getCosUtilByAccountId(
          asset.bucket.tencentCloudAccount.id,
        );
        const res = await util.deleteObject({
          Key: `${asset.sha1}${asset.fileSuffix}`,
          Bucket: asset.bucket.Bucket,
          Region: asset.bucket.Region,
        });
        if (res.statusCode !== HttpStatus.NO_CONTENT) {
          throw new ServiceUnavailableException(`删除cos源文件失败, 数据库回滚`);
        }
        await transactionalEntityManager.remove(asset);
      }
    });
    return SUCCESS;
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
    const buckets = await this.bucketService.all();
    for (const bucket of buckets) {
      const util = await this.tencentCloudAccountService.getCosUtilByAccountId(
        bucket.tencentCloudAccount.id,
      );
      const objects = await util.getBucket(bucket);
      for (const object of objects.Contents) {
        const fileExtname = extname(object.Key);
        const hash = basename(object.Key, fileExtname);
        const fileSuffix = fileExtname.substring(1);
        const asset = await this.assetDao.findOneBy({ sha1: hash });
        // asset 不存在
        if (isNull(asset)) {
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
    const publicAssetSource = await this.publicAssetSource();
    return this.assetDao.findOneOrFail({
      where: [
        {
          id,
          uploadBy: In([...ids, ...publicAssetSource.publicUserIds]),
        },
        {
          id,
          bucket: In(publicAssetSource.publicBucketIds),
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
   * @param uploadBy
   */
  async manualUpload(buffer: Buffer, bucketName: CosBucket['name'], uploadBy: User) {
    let asset = this.assetDao.create();
    asset.sha1 = sha1(buffer);
    // 已经上传过的
    const result = await this.assetDao.findOneBy({ sha1: asset.sha1 });
    if (isNotNull(result)) {
      return result;
    }
    // 库里面木有
    asset.bucket = await this.bucketService.getBucketByBucketName(bucketName);
    asset.uploadBy = uploadBy;
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
      // 再查一遍 返回 objectUrl
      asset = await this.assetDao.findOneByOrFail({ id: asset.id });
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
    const bucket = await this.bucketService.getBucketByBucketName(bucketName);
    const max = await this.assetDao.findOne({
      order: { id: 'DESC' },
      where: {
        bucket: { name: bucketName },
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

  async infiniteQuery(
    cursor?: Asset['id'],
    ids: User['id'][] = [],
    take: number = 20,
  ): Promise<InfiniteQueryResponse<Asset>> {
    const BotUser = await this.userService.getAssetBotUser();
    const res = await this.assetDao.find({
      where: {
        id: LessThan(cursor || 2 ** 31 - 1),
        uploadBy: {
          id: In(ids.concat(BotUser.id)),
        },
      },
      order: {
        id: 'DESC',
      },
      take,
    });
    return {
      resources: res,
      nextCursor: res.length === take ? lastItem(res)?.id : undefined,
    };
  }

  async randomAsset() {
    const publicBucketIds = await this.bucketService.listPublicBucket(true);
    return this.assetDao
      .createQueryBuilder()
      .where({
        bucket: { id: In(publicBucketIds) },
      })
      .orderBy('random()')
      .limit(1)
      .getOne();
  }

  async randomPostPoster() {
    const publicBucketIds = await this.bucketService.listPublicBucket(true);
    return this.assetDao
      .createQueryBuilder()
      .where(
        `cast(size->>'width' as int) between 700 and 1000
                  and cast(size->>'height' as int) between 420 and 600
                  and "bucketId" = ANY(:publicBucketIds)`,
        { publicBucketIds },
      )
      .orderBy('random()')
      .limit(1)
      .getOne();
  }
}
