import { getEXIF } from '@/addon';
import type { QueryAssetsDto } from '@/asset/dto/query-assets.dto';
import { Asset } from '@/asset/entities/asset.entity';
import { BucketService } from '@/bucket/bucket.service';
import type { CosBucket } from '@/bucket/entities/bucket.entity';
import { LoggerService } from '@/common/logger/logger.service';
import { AZUKI_ASSET_PATH, getBucketAssetPath } from '@/constants/asset_constants';
import { ScheduleType } from '@/enum/ScheduleType';
import { InstagramBotService } from '@/libs/instagram-bot';
import { PinterestBotService } from '@/libs/pinterest-bot';
import type { PinterestInterface } from '@/libs/pinterest-bot';
import { PixivBotService } from '@/libs/pixiv-bot';
import { ProxyFetchService } from '@/libs/proxy-fetch';
import { BaseService } from '@/service/base/BaseService';
import { MqService } from '@/service/mq/mq.service';
import { TencentCloudAccountService } from '@/tencent-cloud-account/tencent-cloud-account.service';
import { OcrService } from '@/tools/ocr/ocrService';
import type { AuthorizationParams, InfiniteQueryParams } from '@/type/InfiniteQueryParams';
import type { UploadFile, UploadFileMsg } from '@/type/UploadFile';
import type { User } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';
import { is_TEST_BUCKET_ONLY, TEST_BUCKET_ONLY } from '@/utils/env';
import {
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { calculateHammingDistances, pHash, sha1 } from '@powerfulyang/node-utils';
import { firstItem, isArray, isNotNull, isNull, lastItem } from '@powerfulyang/utils';
import { ensureFileSync } from 'fs-extra';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { DataSource, In, Not, Repository } from 'typeorm';
import fetch from 'node-fetch';
import { join } from 'node:path';

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
    private readonly ocrService: OcrService,
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

  async fetchUndoes(bucketName: string) {
    switch (bucketName) {
      case ScheduleType.instagram: {
        const max = await this.assetDao.findOne({
          order: { id: 'DESC' },
          where: {
            bucket: { name: bucketName },
            sn: Not(''),
          },
        });
        return this.instagramBotService.fetchUndo(max?.sn);
      }
      case ScheduleType.pinterest: {
        const max = await this.assetDao.findOne({
          order: { sn: 'DESC' },
          where: {
            bucket: { name: bucketName },
            sn: Not(''),
          },
        });
        return this.pinterestBotService.fetchUndo(max?.sn);
      }
      case ScheduleType.pixiv: {
        const max = await this.assetDao.findOne({
          order: { id: 'DESC' },
          where: {
            bucket: { name: bucketName },
            sn: Not(''),
          },
        });
        return this.pixivBotService.fetchUndo(max?.sn);
      }
      default:
        throw new UnprocessableEntityException('bucketName is not support');
    }
  }

  private async processAsset(
    buffer: Buffer,
    options: {
      bucketName: CosBucket['name'];
      uploadBy: User;
      async?: boolean;
      assetAddition?: Partial<Asset>;
    },
  ) {
    const { bucketName, uploadBy, async = true, assetAddition = {} } = options;

    const _asset = this.assetDao.create(assetAddition);
    _asset.sha1 = sha1(buffer);
    // 查找是否已经上传
    const existingAsset = await this.assetDao.findOneBy({ sha1: _asset.sha1 });
    if (isNotNull(existingAsset)) {
      return existingAsset;
    }

    const metadata = await this.getAssetMetadata(buffer);
    if (!metadata.format) {
      throw new Error('bot => unsupported media type!');
    }

    const toUploadBucket = is_TEST_BUCKET_ONLY ? TEST_BUCKET_ONLY : bucketName;
    _asset.bucket = await this.bucketService.getBucketByBucketName(toUploadBucket);
    _asset.uploadBy = uploadBy;

    const { bucket } = _asset;
    const _fileSuffix = metadata.format;
    const _pHash = await pHash(buffer);
    _asset.fileSuffix = _fileSuffix;
    _asset.pHash = _pHash;
    const path = getBucketAssetPath(bucket.Bucket, `${_asset.sha1}.${_asset.fileSuffix}`);

    if (!existsSync(path)) {
      ensureFileSync(path);
      writeFileSync(path, buffer);
    }
    _asset.exif = getEXIF(path);
    _asset.metadata = metadata;
    const { text } = await this.ocrService.recognize(path);
    _asset.alt = text;
    const asset = await this.assetDao.save(_asset);

    const data: UploadFileMsg = {
      sha1: asset.sha1,
      suffix: asset.fileSuffix,
      name: bucket.name,
    };
    if (async) {
      this.mqService.notifyUploadToCos(data);
    } else {
      const { objectUrl } = await this.persistentToCos(data);
      asset.objectUrl = objectUrl;
    }
    return asset;
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

    const headers = { refer: '' };
    if (bucketName === ScheduleType.pinterest) {
      headers.refer = 'https://www.pinterest.com/';
    }
    const undoes: PinterestInterface[] = await this.fetchUndoes(bucketName);

    this.logger.info(`[${bucketName}]: undoes count is ${undoes.length}`);
    for (const undo of undoes.reverse()) {
      this.logger.info(`[${bucketName}]: ${undo.id}\n${undo.imgList.join('\n')}`);
      // check if the asset sn is already exist
      const existingAsset = await this.assetDao.exist({
        where: {
          sn: undo.id,
        },
      });
      if (existingAsset) {
        this.logger.info(`[${bucketName}]: ${undo.id} is already exist`);
      } else {
        for (const imgUrl of undo.imgList) {
          try {
            const res = await this.fetchImgBuffer(imgUrl, headers);
            const buffer = await res.buffer();

            await this.processAsset(buffer, {
              bucketName: bucket.name,
              uploadBy: await this.userService.getAssetBotUser(),
              async: true,
              assetAddition: {
                sn: undo.id,
                originUrl: undo.originUrl,
                tags: undo.tags,
              },
            });
          } catch (e) {
            this.logger.error(e);
          }
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
        alt: true,
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
    const bucket = await this.bucketService.getBucketByBucketName(name);
    const path = getBucketAssetPath(bucket.Bucket, Key);
    const buffer = readFileSync(path);
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

  // 分离出一些辅助函数
  private async getAssetMetadata(buffer: Buffer) {
    const s = sharp(buffer);
    return s.metadata();
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
    return this.processAsset(buffer, {
      bucketName,
      uploadBy,
      async: false,
    });
  }

  private updateAssetByHash(hash: string, asset: Partial<Asset>) {
    return this.assetDao.update(
      {
        sha1: hash,
      },
      asset,
    );
  }

  async addAlt() {
    const assets = await this.assetDao.find({
      relations: ['bucket'],
    });
    for (const asset of assets) {
      try {
        const path = getBucketAssetPath(asset.bucket.Bucket, `${asset.sha1}.${asset.fileSuffix}`);
        const { text } = await this.ocrService.recognize(path);
        await this.assetDao.update(asset.id, {
          alt: text,
        });
      } catch (e) {
        this.logger.error(e);
      }
    }
  }

  async backupZukui() {
    const prefix = 'http://1.15.136.103:81/azuki';
    for (let i = 1; i < 10000; i++) {
      try {
        const res = await fetch(`${prefix}/${i}.png`);
        const buffer = await res.buffer();
        const file = join(AZUKI_ASSET_PATH, `${i}.png`);
        ensureFileSync(file);
        writeFileSync(file, buffer);
      } catch (e) {
        this.logger.error(e);
      }
    }
  }
}
