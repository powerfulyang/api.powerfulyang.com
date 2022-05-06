import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { AssetModule } from '@/modules/asset/asset.module';
import { OrmModule } from '@/common/ORM/orm.module';
import { SUCCESS } from '@/constants/constants';
import type { User } from '@/modules/user/entities/user.entity';
import { AssetService } from './asset.service';

describe('AssetService', () => {
  let service: AssetService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OrmModule, AssetModule],
    }).compile();

    service = module.get<AssetService>(AssetService);
  });

  it('publicAssetSource', async () => {
    const res = await service.listPublicAssetSource();
    expect(res).toBeDefined();
  });

  it('getAssets', async () => {
    const res = await service.getAssets();
    expect(res).toBeDefined();
  });

  it('all', async () => {
    const res = await service.all();
    expect(res).toBeDefined();
  });

  it('pHashMap', async () => {
    const maps = await service.pHashMap();
    expect(maps).toBeDefined();
  });

  it('saveAssetToBucket and delete', async () => {
    const file = readFileSync(`${process.cwd()}/assets/test.jpg`);
    const res = await service.saveAssetToBucket(
      [
        {
          buffer: file,
        },
      ],
      'test',
      {
        id: 1,
      } as User,
    );
    expect(res).toBeDefined();
    const result = await service.deleteAsset(res.map((asset) => asset.id));
    expect(result).toBe(SUCCESS);
  });

  it('syncFromCos', async () => {
    const res = await service.syncFromCos();
    expect(res).toBeDefined();
  });

  it('infiniteQuery', async () => {
    let result = await service.infiniteQuery();
    while (result.nextCursor) {
      result = await service.infiniteQuery({
        nextCursor: result.nextCursor,
      });
      expect(result.resources).toBeDefined();
    }
  });

  it('randomAsset', async () => {
    const res = await service.randomAsset();
    expect(res).toBeDefined();
  });

  it('persistentToCos', async () => {
    const res = await service.persistentToCos({
      name: 'test',
      sha1: 'ce023b330af210666072c097f33666e5bbf2b2df',
      suffix: 'jpeg',
    });
    expect(res).toBeDefined();
  });
});
