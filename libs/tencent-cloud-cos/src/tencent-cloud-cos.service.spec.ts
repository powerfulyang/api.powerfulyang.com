import { Test, TestingModule } from '@nestjs/testing';
import { TencentCloudCosService } from './tencent-cloud-cos.service';

describe('TencentCloudCosService', () => {
    let service: TencentCloudCosService;

    beforeEach(async () => {
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
});
