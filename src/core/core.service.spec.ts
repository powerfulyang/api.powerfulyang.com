import { CoreService } from '@/core/core.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AssetBucket } from '@/enum/AssetBucket';
import { AppModule } from '@/app.module';

describe('core service test', function () {
  let service: CoreService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<CoreService>(CoreService);
  });

  it('should getBucket', async function () {
    await expect(service.getBotBucket(AssetBucket.pixiv)).resolves.toBeDefined();
  });

  it('notifyCos', async function () {
    const res = await service.notifyCos({
      sha1: '11111',
      suffix: '2222',
      bucketName: AssetBucket.gallery,
    });
    expect(res).toBeDefined();
  });
});
