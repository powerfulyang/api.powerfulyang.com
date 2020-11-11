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
});
