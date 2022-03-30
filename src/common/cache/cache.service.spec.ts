import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';
import { CacheModule } from '@/common/cache/cache.module';
import { LoggerModule } from '@/common/logger/logger.module';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, CacheModule],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('hash set, hash get test', async () => {
    await service.hSet('users', '1', { user: 'first user' });
    await service.hSet('users', '1', { user: 'second user' });
    const selectUser = await service.hGet('users', '1');
    expect(selectUser).toStrictEqual({ user: 'second user' });
  });

  it('hash multiple set test', async () => {
    const commandResult = await service.hSet('test_hash', {
      a: 'a',
      b: {
        c: 'c',
      },
    });
    expect(commandResult).toBe(0);
    const result = await service.hGet('test_hash', 'a');
    expect(result).toBe('a');
    const result2 = await service.hGet('test_hash', 'b');
    expect(result2).toStrictEqual({ c: 'c' });
  });

  it('set add test', async () => {
    const toAdd = ['1', '2', '3'];
    await service.del('test_set');
    const commandResult = await service.sAdd('test_set', toAdd);
    expect(commandResult).toBe(toAdd.length);
    const result = await service.sMembers('test_set');
    expect(result).toStrictEqual(toAdd);
  });

  it('del key', async function () {
    const result = await service.del(REDIS_KEYS.USERS);
    expect(result).toBe(0);
  });
});
