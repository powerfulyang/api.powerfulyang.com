import { Test, TestingModule } from '@nestjs/testing';
import { BucketService } from './bucket.service';
import { AppModule } from '@/app.module';

describe('BucketService', () => {
  let service: BucketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<BucketService>(BucketService);
  });

  it('all', async () => {
    const res = await service.all();
    expect(res).toBeDefined();
  });

  it('createNewBucket', async () => {
    const res = await service.createNewBucket({
      Bucket: 'test',
      Region: 'ap-shanghai',
      tencentCloudAccount: {
        id: 1,
      },
    });
    expect(res).toBeDefined();
  });

  it('getBucketByBucketName', async () => {
    const res = await service.getBucketByBucketName('test');
    expect(res).toBeDefined();
  });

  it('initBucket', async () => {
    const res = await service.initBucket();
    expect(res).toBeDefined();
  });

  it('syncFromCloud', async () => {
    const res = await service.syncFromCloud(
      { id: 1 },
      {
        Bucket: 'test',
        Region: 'ap-shanghai',
      },
    );
    expect(res).toBeDefined();
  });

  it('listPublicBucket', async () => {
    const res = await service.listPublicBucket();
    expect(res).toBeDefined();
  });

  it('listPublicBucket only ids', async () => {
    const res = await service.listPublicBucket(true);
    expect(res).toBeDefined();
  });
});
