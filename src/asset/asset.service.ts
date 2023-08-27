import { getBucketAssetPath } from '@/constants/asset_constants';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, extname } from 'node:path';
import {
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { calculateHammingDistances, pHash, sha1 } from '@powerfulyang/node-utils';
import { firstItem, isArray, isNotNull, isNull, lastItem } from '@powerfulyang/utils';
import fetch from 'node-fetch';
import type { Metadata } from 'sharp';
import sharp from 'sharp';
import { DataSource, In, Not, Repository } from 'typeorm';
import { getEXIF } from '@/addon';
import { LoggerService } from '@/common/logger/logger.service';
import { BaseService } from '@/service/base/BaseService';
import { MqService } from '@/service/mq/mq.service';
import { ScheduleType } from '@/enum/ScheduleType';
import type { QueryAssetsDto } from '@/asset/dto/query-assets.dto';
import { Asset } from '@/asset/entities/asset.entity';
import { BucketService } from '@/bucket/bucket.service';
import type { CosBucket } from '@/bucket/entities/bucket.entity';
import { InstagramBotService } from '@/libs/instagram-bot';
import { PinterestBotService } from '@/libs/pinterest-bot';
import type { PinterestInterface } from '@/libs/pinterest-bot/pinterest.interface';
import { PixivBotService } from '@/libs/pixiv-bot';
import { TencentCloudAccountService } from '@/tencent-cloud-account/tencent-cloud-account.service';
import type { User } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';
import type { AuthorizationParams, InfiniteQueryParams } from '@/type/InfiniteQueryParams';
import type { UploadFile, UploadFileMsg } from '@/type/UploadFile';
import { is_TEST_BUCKET_ONLY, TEST_BUCKET_ONLY } from '@/utils/env';
import { ProxyFetchService } from '@/libs/proxy-fetch';
import process from 'node:process';

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

  allAssets() {
    return this.assetDao.find({
      relations: ['bucket', 'bucket.tencentCloudAccount'],
    });
  }

  async pHashMap() {
    const assets = await this.assetDao.find({
      select: ['id', 'pHash'],
    });
    const distanceMap = await calculateHammingDistances(
      assets.map((asset) => {
        return {
          id: asset.id,
          p_hash: asset.pHash,
        };
      }),
    );
    const obj = Object.create(null);
    distanceMap.forEach((val: any, key: any) => {
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
          relations: ['bucket', 'bucket.tencentCloudAccount'],
        });
        const util = await this.tencentCloudAccountService.getCosUtilByAccountId(
          asset.bucket.tencentCloudAccount.id,
        );
        await transactionalEntityManager.remove(asset);
        const res = await util.deleteObject({
          Key: `${asset.sha1}.${asset.fileSuffix}`,
          Bucket: asset.bucket.Bucket,
          Region: asset.bucket.Region,
        });
        if (res.statusCode !== HttpStatus.NO_CONTENT) {
          throw new ServiceUnavailableException(`delete asset ${id} failed, rollback`);
        }
      }
    });
  }

  async getObjectUrl(Key: string, bucket: CosBucket) {
    const util = await this.tencentCloudAccountService.getCosUtilByAccountId(
      bucket.tencentCloudAccount.id,
    );
    const { Bucket, Region } = bucket;
    return util.getSignedObjectUrl({
      Bucket,
      Region,
      Key,
    });
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
          const objectUrl = await this.getObjectUrl(object.Key, bucket);
          const path = getBucketAssetPath(bucket.name, `${hash}.${fileSuffix}`);

          const exist = existsSync(path);
          if (!exist) {
            // 需要下载下来
            const res = await fetch(objectUrl.original);
            const buffer = await res.buffer();
            // 校验 hash
            const tmp = sha1(buffer);

            if (tmp !== hash) {
              this.logger.error(new Error(`文件 ${object.Key} hash校验失败`));
              // eslint-disable-next-line no-continue
              continue;
            }

            writeFileSync(path, buffer);
          }

          const buffer = readFileSync(path);
          // 读取元信息
          const exif = getEXIF(path);
          const metadata = await sharp(path).metadata();
          const phash = await pHash(buffer);
          const uploadBy = await this.userService.getAssetBotUser();

          const newAsset = this.assetDao.create({
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

  private async fetchUndoes(
    bucketName: string,
    maxSn: string | undefined,
    headers: Record<string, string>,
  ) {
    switch (bucketName) {
      case ScheduleType.instagram:
        return this.instagramBotService.fetchUndo(maxSn);
      case ScheduleType.pinterest:
        // eslint-disable-next-line no-param-reassign
        headers.refer = 'https://www.pinterest.com/';
        return this.pinterestBotService.fetchUndo(maxSn);
      case ScheduleType.pixiv:
        return this.pixivBotService.fetchUndo(maxSn);
      default:
        throw new UnprocessableEntityException('bucketName is not support');
    }
  }

  private async createAsset(undo: { id: any; originUrl: any; tags: any }, bucket: CosBucket) {
    const asset = this.assetDao.create({
      sn: undo.id,
      originUrl: undo.originUrl,
      tags: undo.tags,
      uploadBy: await this.userService.getAssetBotUser(),
    });
    asset.bucket = bucket;
    return asset;
  }

  private async processAsset(asset: Asset, buffer: Buffer, metadata: Metadata, bucket: CosBucket) {
    if (!metadata.format) {
      throw new Error('bot => unsupported media type!');
    }
    const _asset = asset;
    _asset.fileSuffix = metadata.format;
    _asset.pHash = await pHash(buffer);
    const path = getBucketAssetPath(bucket.name, `${asset.sha1}.${asset.fileSuffix}`);
    _asset.exif = getEXIF(path);
    _asset.metadata = metadata;
    await this.assetDao.save(asset);
    writeFileSync(path, buffer);

    this.mqService.notifyUploadToCos({
      sha1: asset.sha1,
      suffix: asset.fileSuffix,
      name: bucket.name,
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

    const headers = { refer: '' };
    const undoes: PinterestInterface[] = await this.fetchUndoes(bucketName, max?.sn, headers);

    this.logger.info(`undoes count:[${bucketName}] -> ${undoes.length}`);
    for (const undo of undoes.reverse()) {
      this.logger.info(`[${bucketName}] -> ${undo.id} -> ${undo.imgList.join('\n')}`);
      for (const imgUrl of undo.imgList) {
        try {
          const asset = await this.createAsset(undo, bucket);
          const res = await this.fetchImgBuffer(imgUrl, headers);
          const buffer = await res.buffer();
          const metadata = await sharp(buffer).metadata();
          asset.sha1 = sha1(buffer);

          await this.processAsset(asset, buffer, metadata, bucket);
        } catch (e) {
          this.logger.error(e);
        }
      }
    }
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
        objectUrl: {
          original: true,
          thumbnail_300_: true,
          thumbnail_700_: true,
          webp: true,
          thumbnail_blur_: true,
        },
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

  async randomPoster() {
    const publicBucketIds = await this.bucketService.listPublicBucket(true);
    const result = await this.assetDao
      .createQueryBuilder()
      // 宽高比大于 1
      .where("round(cast(size ->> 'width' as numeric) / cast(size ->> 'height' as numeric), 2) > 1")
      // 公开的 bucket
      .andWhere('"bucketId" = ANY(:publicBucketIds)', { publicBucketIds })
      // 小于 100kb
      .andWhere("cast(metadata->>'size' as int) < 100 * 1000")
      // 不要已使用过的 post poster
      .andWhere('id not in (select "posterId" from "post")')
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
    const { name } = data;
    const path = getBucketAssetPath(name, Key);
    const buffer = readFileSync(path);
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
    if (res.statusCode !== HttpStatus.OK) {
      throw new Error('upload to cos error');
    }
    const objectUrl = await util.getSignedObjectUrl({
      Bucket,
      Region,
      Key,
    });
    await this.updateAssetByHash(data.sha1, {
      objectUrl,
    });
    return {
      objectUrl,
    };
  }

  updateAssetObjectUrl(id: number, objectUrl: Asset['objectUrl']) {
    return this.assetDao.update(id, {
      objectUrl,
    });
  }

  queryAssets(pagination: QueryAssetsDto) {
    const { take, skip, updatedAt, createdAt, sha1: _sha1, id, originUrl } = pagination;
    return this.assetDao.findAndCount({
      where: {
        id: super.ignoreFalsyValue(id),
        sha1: super.ignoreFalsyValue(_sha1),
        createdAt: super.convertDateRangeToBetween(createdAt),
        updatedAt: super.convertDateRangeToBetween(updatedAt),
        originUrl: super.ignoreFalsyValue(originUrl),
      },
      skip,
      take,
      order: {
        id: 'DESC',
      },
    });
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
      throw new UnsupportedMediaTypeException('unsupported media type');
    }
    asset.fileSuffix = metadata.format;
    asset.pHash = await pHash(buffer);
    try {
      const path = getBucketAssetPath(asset.bucket.name, `${asset.sha1}.${asset.fileSuffix}`);
      asset.exif = getEXIF(path);
      asset.metadata = metadata;
      asset = await this.assetDao.save(asset);
      writeFileSync(path, buffer);
      const data: UploadFileMsg = {
        sha1: asset.sha1,
        suffix: asset.fileSuffix,
        name: asset.bucket.name,
      };
      const { objectUrl } = await this.persistentToCos(data);
      asset.objectUrl = objectUrl;
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
