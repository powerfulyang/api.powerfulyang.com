import { Test, TestingModule } from '@nestjs/testing';
import { PublicService } from './public.service.mjs';
import { AppModule } from '@/app.module.mjs';

describe('PublicService', () => {
  let service: PublicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<PublicService>(PublicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('all tags', async () => {
    const countTags = await service.getPublicPostTags();
    expect(countTags).toBeDefined();
  });
});
