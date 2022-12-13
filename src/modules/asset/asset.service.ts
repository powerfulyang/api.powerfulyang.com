import {
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Not, Repository } from 'typeorm';
import { binaryHammingDistance, pHash, sha1 } from '@powerfulyang/node-utils';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { basename, extname, join } from 'path';
import fetch from 'node-fetch';
import sharp from 'sharp';
import { PixivBotService } from 'api/pixiv-bot';
import { InstagramBotService } from 'api/instagram-bot';
import { PinterestBotService } from 'api/pinterest-bot';
import { ProxyFetchService } from 'api/proxy-fetch';
import type { PinterestInterface } from 'api/pinterest-bot/pinterest.interface';
import { firstItem, isArray, isNotNull, isNull, lastItem } from '@powerfulyang/utils';
import type { UploadFile, UploadFileMsg } from '@/type/UploadFile';
import { Asset } from '@/modules/asset/entities/asset.entity';
import type { User } from '@/modules/user/entities/user.entity';
import type { CosBucket } from '@/modules/bucket/entities/bucket.entity';
import { LoggerService } from '@/common/logger/logger.service';
import { ScheduleType } from '@/enum/ScheduleType';
import { TencentCloudAccountService } from '@/modules/tencent-cloud-account/tencent-cloud-account.service';
import { UserService } from '@/modules/user/user.service';
import { BucketService } from '@/modules/bucket/bucket.service';
import { MqService } from '@/common/service/mq/mq.service';
import type { AuthorizationParams, InfiniteQueryParams } from '@/type/InfiniteQueryParams';
import { is_TEST_BUCKET_ONLY, TEST_BUCKET_ONLY } from '@/utils/env';
import { BaseService } from '@/common/service/base/BaseService';
import { getEXIF } from '../../../addon-api';

@Injectable()
export class AssetService extends BaseService {
  constructor(
    @InjectRepository(Asset) private readonly assetDao: Repository<Asset>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly mqService: MqService,
    private readonly pixivBotService: PixivBotService,
    private readonly instagramBotService: InstagramBotService,
    private readonly pinterestBotService: PinterestBotService,
    private readonly logger: LoggerService,
    private readonly proxyFetchService: ProxyFetchService,
    private readonly tencentCloudAccountService: TencentCloudAccountService,
    private readonly userService: UserService,
    private readonly bucketService: BucketService,
  ) {
    super();
    this.logger.setContext(AssetService.name);
  }

  async listPublicAssetSource() {
    const publicBuckets = await this.bucketService.listPublicBucket();
    const publicUsers = await this.userService.listAssetPublicUser();
    return {
      publicBucketIds: publicBuckets.map((bucket) => bucket.id),
      publicUserIds: publicUsers.map((user) => user.id),
    };
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
          const distance = binaryHammingDistance(asset.pHash, next.pHash);
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

  async saveAssetToBucket(
    files: Pick<UploadFile, 'data'>[],
    bucketName: CosBucket['name'],
    uploadBy: User,
  ) {
    const assets: Asset[] = [];
    for (const file of files) {
      const asset = await this.manualUploadImageToCos(file.data, bucketName, uploadBy);
      assets.push(asset);
    }
    return assets;
  }

  /**
   * 批量删除 asset
   * @param ids
   */
  deleteAsset(ids: number[]) {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      for (const id of ids) {
        const asset = await transactionalEntityManager.findOneOrFail(Asset, {
          where: { id },
        });
        const util = await this.tencentCloudAccountService.getCosUtilByAccountId(
          asset.bucket.tencentCloudAccount.id,
        );
        const res = await util.deleteObject({
          Key: `${asset.sha1}.${asset.fileSuffix}`,
          Bucket: asset.bucket.Bucket,
          Region: asset.bucket.Region,
        });
        if (res.statusCode !== HttpStatus.NO_CONTENT) {
          throw new ServiceUnavailableException(`删除cos源文件失败, 数据库回滚`);
        }
        await transactionalEntityManager.remove(asset);
      }
    });
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
      Expires: 60 * 60 * 24 * 31, // 31day
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
        const asset = await this.getAssetByHash(hash);
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
            // 校验 hash
            const tmp = sha1(buffer);
            writeFileSync(path, buffer);
            if (tmp !== hash) {
              this.logger.error(new Error(`文件 ${object.Key} hash校验失败`));
              // eslint-disable-next-line no-continue
              continue;
            }
          }
          const buffer = readFileSync(path);
          // 读取元信息
          const exif = getEXIF(path);
          const metadata = await sharp(path).metadata();
          const phash = await pHash(buffer);
          const uploadBy = await this.userService.getAssetBotUser();
          const newAsset = this.assetDao.create({
            cosUrl,
            sha1: hash,
            objectUrl,
            fileSuffix,
            pHash: phash,
            exif,
            metadata,
            bucket,
            uploadBy,
          });
          process.nextTick(() => {
            this.assetDao.save(newAsset);
          });
        }
      }
    }
  }

  getAssetById(id: Asset['id']): Promise<Asset>;

  getAssetById(ids: Asset['id'][]): Promise<Asset[]>;

  async getAssetById(id: Asset['id'] | Asset['id'][]) {
    if (isArray(id)) {
      return this.assetDao.find({
        where: { id: In(id) },
      });
    }
    return this.assetDao.findOneOrFail({
      where: { id },
    });
  }

  async getAccessAssetById(id: Asset['id'], userIds: User['id'][] = []) {
    const publicAssetSource = await this.listPublicAssetSource();
    return this.assetDao.findOneOrFail({
      where: [
        {
          id,
          uploadBy: In([...userIds, ...publicAssetSource.publicUserIds]),
        },
        {
          id,
          bucket: In(publicAssetSource.publicBucketIds),
        },
      ],
      relations: ['uploadBy'],
    });
  }

  /**
   * bot 定时 下载图片
   * @param bucketName
   */
  async assetBotSchedule(bucketName: CosBucket['name']) {
    const bucket = await this.bucketService.findBucketByName(bucketName);
    if (isNull(bucket)) {
      return;
    }
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
      this.logger.info(`[${bucketName}] -> ${undo.id} -> ${undo.imgList.join('\n')}`);
      for (const imgUrl of undo.imgList) {
        try {
          let asset = this.assetDao.create();
          asset.sn = undo.id;
          asset.originUrl = undo.originUrl;
          asset.tags = undo.tags;
          // ε=(´ο｀*))) 专属的脚本机器人
          asset.uploadBy = await this.userService.getAssetBotUser();
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
            asset = await this.assetDao.save(asset);
            writeFileSync(path, buffer);
            this.mqService.notifyUploadToCos({
              sha1: asset.sha1,
              suffix: asset.fileSuffix,
              name: bucket.name,
            });
          } else {
            this.logger.error(new Error('bot => unsupported media type!'));
          }
        } catch (e) {
          this.logger.error(e);
        }
      }
    }
  }

  updateAssetObjectUrl(id: number, objectUrl: string) {
    return this.assetDao.update(id, { objectUrl });
  }

  async infiniteQuery(params: InfiniteQueryParams<AuthorizationParams> = {}) {
    const { userIds = [], prevCursor, nextCursor } = params;
    const take = this.formatInfiniteTake(params.take);
    const BotUser = await this.userService.getAssetBotUser();
    const cursor = this.generateInfiniteCursor({
      nextCursor,
      prevCursor,
    });
    const res = await this.assetDao.find({
      select: {
        id: true,
        size: {
          width: true,
          height: true,
        },
        objectUrl: true,
      },
      where: {
        uploadBy: {
          id: In(userIds.concat(BotUser.id)),
        },
        id: cursor,
      },
      order: {
        id: 'DESC',
      },
      take,
      loadEagerRelations: false,
    });
    return {
      resources: res,
      prevCursor: (res.length === take && lastItem(res)?.id) || null,
      nextCursor: firstItem(res)?.id || null,
    };
  }

  async randomAsset() {
    const publicBucketIds = await this.bucketService.listPublicBucket(true);
    const result = await this.assetDao
      .createQueryBuilder()
      // 宽高比大于 1
      .where("round(cast(size ->> 'width' as numeric) / cast(size ->> 'height' as numeric), 2) > 1")
      // 公开的 bucket
      .andWhere('"bucketId" = ANY(:publicBucketIds)', { publicBucketIds })
      // 小于 100kb
      .andWhere("cast(metadata->>'size' as int) < 100 * 1000")
      .orderBy('random()')
      .limit(1)
      .getOne();

    if (result) {
      return result;
    }
    return this.assetDao
      .createQueryBuilder()
      .where(
        `
        "bucketId" = ANY(:publicBucketIds)
        and cast(metadata->>'size' as int) < 100 * 1000
        `,
        { publicBucketIds },
      )
      .orderBy('random()')
      .limit(1)
      .getOne();
  }

  async persistentToCos(data: UploadFileMsg) {
    const Key = `${data.sha1}.${data.suffix}`;
    const buffer = readFileSync(join(process.cwd(), 'assets', Key));
    const { name } = data;
    const bucket = await this.bucketService.getBucketByBucketName(name);
    const { Bucket, Region } = bucket;
    const { tencentCloudAccount } = bucket;
    const util = await this.tencentCloudAccountService.getCosUtilByAccountId(
      tencentCloudAccount.id,
    );
    const res = await util.putObject({
      Bucket,
      Region,
      Key,
      Body: buffer,
    });
    const { Url: objectUrl } = await util.getObjectUrl({
      Bucket,
      Region,
      Key,
      Expires: 60 * 60 * 24 * 31, // 31day
    });
    const cosUrl = `https://${res.Location}`;
    await this.updateAssetByHash(data.sha1, {
      cosUrl,
      objectUrl,
    });
    return { cosUrl, objectUrl };
  }

  private async getCosUrl(Key: string, bucket: CosBucket) {
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

  private getAssetByHash(hash: string) {
    return this.assetDao.findOne({
      where: { sha1: hash },
    });
  }

  private async fetchImgBuffer(imgUrl: string, headers: any) {
    const res = await this.proxyFetchService.proxyFetch(imgUrl, {
      headers,
    });
    this.logger.info(`fetch img status code -> ${res.status}`);
    if (res.status !== HttpStatus.OK) {
      throw new Error(`fetch img error -> ${res.status}`);
    }
    return res;
  }

  /**
   * 手动上传图片
   * @param buffer - 图片 buffer
   * @param bucketName - bucket 名称
   * @param uploadBy - 上传者
   */
  private async manualUploadImageToCos(
    buffer: Buffer,
    bucketName: CosBucket['name'],
    uploadBy: User,
  ) {
    let asset = this.assetDao.create();
    asset.sha1 = sha1(buffer);
    // 已经上传过的
    const result = await this.assetDao.findOneBy({ sha1: asset.sha1 });
    if (isNotNull(result)) {
      return result;
    }
    const toUploadBucket = is_TEST_BUCKET_ONLY ? TEST_BUCKET_ONLY : bucketName;
    // 库里面木有
    asset.bucket = await this.bucketService.getBucketByBucketName(toUploadBucket);
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
      const { cosUrl, objectUrl } = await this.persistentToCos(data);
      asset.objectUrl = objectUrl;
      asset.cosUrl = cosUrl;
    } catch (e) {
      this.logger.error(e);
    }
    return asset;
  }

  private updateAssetByHash(hash: string, asset: Partial<Asset>) {
    return this.assetDao.update(
      {
        sha1: hash,
      },
      asset,
    );
  }
}
