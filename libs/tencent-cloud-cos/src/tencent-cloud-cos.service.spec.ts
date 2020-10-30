import { Test, TestingModule } from '@nestjs/testing';
import { TencentCloudCosService } from './tencent-cloud-cos.service';

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
        await expect(service.listBuckets()).resolves.toBeDefined();
    });

    it('getObjectUrl', async function () {
        await expect(
            service.getObjectUrl({
                Bucket: 'gallery',
                Region: 'ap-shanghai',
                Key: '00057bc319afb8c68d14a9d0883b94ab8601a903.jpg',
            }),
        ).resolves.toHaveProperty('Url');
    });
});
