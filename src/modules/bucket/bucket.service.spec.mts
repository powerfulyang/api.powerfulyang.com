import { Test, TestingModule } from '@nestjs/testing';
import { BucketService } from './bucket.service.mjs';
import { AppModule } from '@/app.module.mjs';

describe('BucketService', () => {
  let service: BucketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<BucketService>(BucketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
