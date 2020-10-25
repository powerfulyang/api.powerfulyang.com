import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
    COS_UPLOAD_MSG_PATTERN,
    MICROSERVICE_NAME,
    Region,
} from '@/constants/constants';
import { ClientProxy } from '@nestjs/microservices';
import { AssetBucket } from '@/enum/AssetBucket';
import { Asset } from '@/entity/asset.entity';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { AppLogger } from '@/common/logger/app.logger';
import { PixivBotService } from 'api/pixiv-bot';
import { ProxyFetchService } from 'api/proxy-fetch';
import { pHash, sha1 } from '@powerfulyang/node-utils';
import {
    __prod__,
    __test__,
    getImageSuffix,
    Memoize,
} from '@powerfulyang/utils';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InstagramBotService } from 'api/instagram-bot';
import { PinterestRssService } from 'api/pinterest-rss';
import { PinterestInterface } from 'api/pinterest-rss/pinterest.interface';
import { Bucket } from '@/entity/bucket.entity';
import { TencentCloudCosService } from 'api/tencent-cloud-cos';

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
    ) {
        this.logger.setContext(CoreService.name);
    }

    notifyCos(notification: {
        sha1: string;
        suffix: string;
        bucketName: AssetBucket;
    }) {
        return this.microserviceClient.emit(
            COS_UPLOAD_MSG_PATTERN,
            notification,
        );
    }

    private async initBucket() {
        for (const bucket of Object.keys(AssetBucket)) {
            let res: any;
            try {
                res = await this.tencentCloudCosService.headBucket({
                    Bucket: bucket,
                    Region,
                });
            } catch (e) {
                res = e;
            }
            if (res.statusCode !== HttpStatus.OK) {
                await this.tencentCloudCosService.putBucket({
                    Bucket: bucket,
                    Region,
                });
            }
            const bucketEntity = await this.bucketDao.findOne({
                bucketName: bucket,
                bucketRegion: Region,
            });
            if (!bucketEntity) {
                await this.bucketDao.insert({
                    bucketName: bucket,
                    bucketRegion: Region,
                });
            }
        }
    }

    @Memoize()
    async getBotBucket(bucketName: string) {
        await this.initBucket();
        this.logger.debug('init buckets complete!');
        return this.bucketDao.findOne({
            bucketName,
            bucketRegion: Region,
        });
    }

    async fetchImgBuffer(imgUrl: string, headers: any) {
        let count = 0;
        let res = await this.proxyFetchService.proxyFetch(imgUrl, {
            headers,
        });
        this.logger.debug(`fetch img status code -> ${res.status}`);
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

    async botBaseService(bucketName: AssetBucket) {
        if (!__prod__ && !__test__) {
            this.logger.debug('dev mode will not run schedule!');
            return;
        }
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
                undoes = await this.instagramBotService.fetchUndo(
                    max?.sn,
                );
                break;
            case AssetBucket.pinterest:
                undoes = await this.pinterestRssService.fetchUndo(
                    max?.sn,
                );
                headers.refer = 'https://www.pinterest.com/';
                break;
            case AssetBucket.pixiv:
                undoes = await this.pixivBotService.fetchUndo(
                    max?.sn,
                );
                break;
            default:
        }
        this.logger.debug(`undoes count -> ${undoes.length}`);
        for (const undo of undoes.reverse()) {
            this.logger.debug(
                `[${bucketName}] -> ${undo.id} -> ${undo.imgList}`,
            );
            for (const imgUrl of undo.imgList) {
                const asset = new Asset();
                asset.sn = undo.id;
                asset.originUrl = undo.originUrl;
                asset.tags = undo.tags;
                try {
                    const res = await this.fetchImgBuffer(
                        imgUrl,
                        headers,
                    );
                    const buffer = await res.buffer();
                    asset.sha1 = sha1(buffer);
                    asset.fileSuffix = getImageSuffix(buffer);
                    asset.pHash = await pHash(buffer);
                    writeFileSync(
                        join(
                            process.cwd(),
                            'assets',
                            asset.sha1 + asset.fileSuffix,
                        ),
                        buffer,
                    );
                } catch (e) {
                    this.logger.error('fetchImgBuffer error', e);
                }
                asset.bucket = (await this.getBotBucket(bucketName))!;
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
            }
        }
    }
}
