import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { AssetModule } from '@/modules/asset/asset.module';
import { OrmModule } from '@/common/ORM/orm.module';

describe('AssetService', () => {
  let service: AssetService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OrmModule, AssetModule],
    }).compile();

    service = module.get<AssetService>(AssetService);
  });

  it('publicAssetSource', async () => {
    const res = await service.publicAssetSource();
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

  it('infiniteQuery', async function () {
    const res = await service.infiniteQuery();
    expect(res).toBeDefined();
  });

  it('randomAsset', async () => {
    const res = await service.randomAsset();
    expect(res).toBeDefined();
  });

  it('randomPostPoster', async () => {
    const res = await service.randomPostPoster();
    expect(res).toBeDefined();
  });
});
