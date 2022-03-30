// test with side effects
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AssetService } from '@/modules/asset/asset.service';
import { AppModule } from '@/app.module';
import { SUCCESS } from '@/constants/constants';

describe('side effects test', () => {
  let assetService: AssetService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    assetService = module.get<AssetService>(AssetService);
  });

  it('assetService side effects test', async function () {
    const res = await assetService.syncFromCos();
    expect(res).toBe(SUCCESS);

    // TODO await assetService.manualUpload();
    // TODO await assetService.assetBotSchedule();
    // TODO await assetService.updateAssetObjectUrl();

    const result = await assetService.deleteAsset([]);
    expect(result).toBe(SUCCESS);
  });
});
