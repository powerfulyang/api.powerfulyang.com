import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { CacheModule } from '@/common/cache/cache.module';

describe('CacheService', () => {
  let service: CacheService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('hash set, hash get test', async () => {
    const key = 'test_hash_key';
    let result = await service.del(key);
    expect(result).toBeGreaterThanOrEqual(0);
    result = await service.hSet(key, '1', { user: 'first user' });
    expect(result).toBe(1);
    result = await service.hSet(key, '1', { user: 'second user' });
    expect(result).toBe(0);
    const selectUser = await service.hGet(key, '1');
    expect(selectUser).toStrictEqual({ user: 'second user' });
  });

  it('hash multiple set test', async () => {
    const key = 'test_hash_key';
    const res = await service.del(key);
    expect(res).toBeGreaterThanOrEqual(0);
    const commandResult = await service.hSet(key, {
      a: 'a',
      b: {
        c: 'c',
      },
    });
    expect(commandResult).toBe(2);
    const result = await service.hGet(key, 'a');
    expect(result).toBe('a');
    const result2 = await service.hGet(key, 'b');
    expect(result2).toStrictEqual({ c: 'c' });
  });

  it('set add test', async () => {
    const toAdd = ['1', '2', '3'];
    const key = 'test_set_key';
    const res = await service.del(key);
    expect(res).toBeGreaterThanOrEqual(0);
    const commandResult = await service.sAdd(key, toAdd);
    expect(commandResult).toBe(toAdd.length);
    const result = await service.sMembers(key);
    expect(result).toStrictEqual(toAdd);
  });
});
