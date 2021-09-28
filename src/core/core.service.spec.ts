import { CoreService } from '@/core/core.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AssetBucket } from '@/enum/AssetBucket';
import { AppModule } from '@/app.module';
import { MessagePatterns } from '@/constants/MessagePatterns';

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

  it('emit hello', async function () {
    const res = await service.microserviceClient.emit(MessagePatterns.test, '');
    expect(res).toBeDefined();
  });

  it('getBotBucket', async function () {
    const res = await service.getBotBucket(AssetBucket.pinterest);
    expect(res).toBeDefined();
  });
});
