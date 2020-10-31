import { Test, TestingModule } from '@nestjs/testing';
import { TencentCloudCosService } from './tencent-cloud-cos.service';
import { AssetBucket } from '@/enum/AssetBucket';
import { Region } from '@/constants/constants';
import { pick } from 'ramda';

describe('TencentCloudCosService', () => {
    let service: TencentCloudCosService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TencentCloudCosService],
        }).compile();

        service = module.get<TencentCloudCosService>(
            TencentCloudCosService,
        );
    });

    it('get Service', async () => {
        const buckets = await service.listBuckets();
        expect(buckets).toBeDefined();
    });

    it('getObjectUrl', async function () {
        await expect(
            service.getObjectUrl({
                Bucket: AssetBucket.gallery,
                Region,
                Key: '00057bc319afb8c68d14a9d0883b94ab8601a903.jpg',
            }),
        ).resolves.toHaveProperty('Url');
    });

    it('putBucketCors', async function () {
        const promises = Object.values(AssetBucket).map((Bucket) => {
            return service.putBucketCors({
                Bucket,
                Region,
                CORSRules: [
                    {
                        AllowedHeader: ['*'],
                        AllowedOrigin: [
                            'https://*.powerfulyang.com',
                            'https://powerfulyang.com',
                        ],
                        AllowedMethod: ['GET'],
                        MaxAgeSeconds: '3650000',
                    },
                ],
            });
        });
        const res = await Promise.all(promises);
        expect(res).toBeDefined();
    });

    it('put bucket referer', async function () {
        const promises = Object.values(AssetBucket).map((Bucket) => {
            return service.putBucketReferer({
                Bucket,
                Region,
                RefererConfiguration: {
                    DomainList: {
                        Domains: [
                            '*.powerfulyang.com',
                            'powerfulyang.com',
                        ],
                    },
                    RefererType: 'White-List',
                    Status: 'Enabled',
                },
            });
        });
        const res = await Promise.all(promises);
        expect(res).toBeDefined();
    });

    it('getBucketCors', async function () {
        const corsConfig = await service.getBucketCors({
            Bucket: AssetBucket.instagram,
            Region,
        });
        expect(corsConfig).toBeDefined();
    });

    it('delete gallery some photo', async function () {
        const list = await service.listObjects({
            Bucket: AssetBucket.gallery,
            Region,
        });
        const toDel = list.Contents.filter(
            (obj) =>
                obj.Key.includes('resize') ||
                obj.Key.includes('webp'),
        );
        const res = await service.deleteMultipleObject({
            Bucket: AssetBucket.gallery,
            Region,
            Objects: toDel.map((del) => pick(['Key'], del)),
        });
        expect(res).toBeDefined();
    });
});
