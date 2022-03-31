import { Test, TestingModule } from '@nestjs/testing';
import { BucketService } from './bucket.service';
import { BucketModule } from '@/modules/bucket/bucket.module';

describe('BucketService', () => {
  let service: BucketService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BucketModule],
    }).compile();

    service = module.get<BucketService>(BucketService);
  });

  it('all', async () => {
    const res = await service.all();
    expect(res).toBeDefined();
  });

  it('createNewBucket', async () => {
    const res = await service.createNewBucket({
      name: 'test',
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

  it('listPublicBucket', async () => {
    const res = await service.listPublicBucket();
    expect(res).toBeDefined();
  });

  it('listPublicBucket only ids', async () => {
    const res = await service.listPublicBucket(true);
    expect(res).toBeDefined();
  });
});
