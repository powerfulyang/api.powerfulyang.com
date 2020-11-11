import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { AppModule } from '@/app.module';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('hash set, hash get test', async () => {
    await service.hashSet('users', '1', { user: 'first user' });
    await service.hashSet('users', '2', { user: 'second user' });
    const selectUser = await service.hashGet('users', '1');
    expect(selectUser).toBeDefined();
  });
});
