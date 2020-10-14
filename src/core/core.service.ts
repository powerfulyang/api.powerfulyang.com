import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
    COS_UPLOAD_MSG_PATTERN,
    MICROSERVICE_NAME,
} from '@/constants/constants';
import { ClientProxy } from '@nestjs/microservices';
import { AssetOrigin } from '@/enum/AssetOrigin';
import { Asset } from '@/entity/asset.entity';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { AppLogger } from '@/common/logger/app.logger';
import { PixivBotService } from 'api/pixiv-bot';
import { ProxyFetchService } from 'api/proxy-fetch';
import { pHash, sha1 } from '@powerfulyang/node-utils';
import {
    __dev__,
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
        origin: AssetOrigin;
    }) {
        return this.microserviceClient.emit(
            COS_UPLOAD_MSG_PATTERN,
            notification,
        );
    }

    private async initBucket() {
        for (const origin of Object.keys(AssetOrigin)) {
            let res: any;
            try {
                res = await this.tencentCloudCosService.headBucket(
                    origin,
                    'ap-shanghai',
                );
            } catch (e) {
                res = e;
            }
            if (res.statusCode !== HttpStatus.OK) {
                await this.tencentCloudCosService.putBucket(
                    origin,
                    'ap-shanghai',
                );
                await this.tencentCloudCosService.putBucketAcl(
                    origin,
                    'ap-shanghai',
                    'public-read',
                );
            }
            const bucket = await this.bucketDao.findOne({
                bucketName: origin,
                bucketRegion: 'ap-shanghai',
            });
            if (!bucket) {
                await this.bucketDao.insert({
                    bucketName: origin,
                    bucketRegion: 'ap-shanghai',
                });
            }
        }
    }

    @Memoize()
    async getBotBucket(origin: string) {
        await this.initBucket();
        this.logger.debug('init buckets complete!');
        return this.bucketDao.findOne({
            bucketName: origin,
            bucketRegion: 'ap-shanghai',
        });
    }

    async botBaseService(origin: AssetOrigin) {
        if (__dev__) {
            this.logger.debug('dev mode will not run schedule!');
            return;
        }
        const max = await this.assetDao.findOne({
            order: { id: 'DESC' },
            where: {
                origin,
            },
        });
        let undoes: PinterestInterface[] = [];
        const headers = { refer: '' };
        switch (origin) {
            case AssetOrigin.instagram:
                undoes = await this.instagramBotService.fetchUndo(
                    max?.sn,
                );
                break;
            case AssetOrigin.pinterest:
                undoes = await this.pinterestRssService.fetchUndo(
                    max?.sn,
                );
                headers.refer = 'https://www.pinterest.com/';
                break;
            case AssetOrigin.pixiv:
                undoes = await this.pixivBotService.fetchUndo(
                    max?.sn,
                );
                break;
            default:
        }
        for (const undo of undoes) {
            this.logger.debug(undo);
            const asset = new Asset();
            asset.sn = undo.id;
            asset.originUrl = undo.originUrl;
            asset.tags = undo.tags;
            asset.origin = origin;
            for (const imgUrl of undo.imgList) {
                const res = await this.proxyFetchService.proxyFetch(
                    imgUrl,
                    { headers },
                );
                const buffer = await res.buffer();
                asset.sha1 = sha1(buffer);
                asset.fileSuffix = getImageSuffix(buffer);
                writeFileSync(
                    join(
                        process.cwd(),
                        'assets',
                        asset.sha1 + asset.fileSuffix,
                    ),
                    buffer,
                );
                this.notifyCos({
                    sha1: asset.sha1,
                    suffix: asset.fileSuffix,
                    origin,
                });
                asset.pHash = await pHash(buffer);
            }
            asset.bucket = (await this.getBotBucket(origin))!;
            this.assetDao.insert(asset);
        }
    }
}
