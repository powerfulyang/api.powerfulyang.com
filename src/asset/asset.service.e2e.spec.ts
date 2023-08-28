import { AssetModule } from '@/asset/asset.module';
import { AssetService } from '@/asset/asset.service';
import { ScheduleType } from '@/enum/ScheduleType';
import { beforeAll, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

describe('AssetService', () => {
  let service: AssetService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AssetModule],
    }).compile();

    service = module.get<AssetService>(AssetService);
  });

  it('fetchUndoes pinterest', async () => {
    const result = await service.fetchUndoes(ScheduleType.pinterest, undefined, {});
    expect(result).toBeDefined();
  }, 100000);
});
