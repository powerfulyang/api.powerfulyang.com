import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { AssetModule } from '@/modules/asset/asset.module';
import { OrmModule } from '@/common/ORM/orm.module';
import { readFileSync } from 'fs';
import { SUCCESS } from '@/constants/constants';

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

  it('pHashMap', async function () {
    const maps = await service.pHashMap();
    expect(maps).toBeDefined();
  });

  it('saveAssetToBucket and delete', async function () {
    const file = readFileSync(process.cwd() + '/assets/test.jpg');
    const res = await service.saveAssetToBucket(
      [
        {
          buffer: file,
        },
      ],
      'test',
      {
        id: 1,
      },
    );
    expect(res).toBeDefined();
    const result = await service.deleteAsset(res.map((asset) => asset.id));
    expect(result).toBe(SUCCESS);
  });

  it('syncFromCos', async () => {
    const res = await service.syncFromCos();
    expect(res).toBeDefined();
  });

  it('infiniteQuery', async function () {
    let result = await service.infiniteQuery();
    while (result.nextCursor) {
      result = await service.infiniteQuery(result.nextCursor);
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
