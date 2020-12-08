import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { AppModule } from '@/app.module';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('hash set, hash get test', async () => {
    await service.hSet('users', '1', { user: 'first user' });
    await service.hSet('users', 1, { user: 'second user' });
    const selectUser = await service.hGet('users', '1');
    expect(selectUser).toStrictEqual({ user: 'second user' });
  });

  it('hash multiple set test', async () => {
    const commandResult = await service.hMSet('test_hash', {
      '/post/1': 10000,
      '/post/2': 10000,
    });
    expect(commandResult).toBe('OK');
  });

  it('set add test', async () => {
    const toAdd = [1, 2, 3];
    await service.del('test_set');
    const commandResult = await service.sAdd('test_set', toAdd);
    expect(commandResult).toBe(toAdd.length);
  });

  it('del key', async function () {
    const result = await service.del(REDIS_KEYS.USERS);
    expect(result).toBe(1);
  });
});
