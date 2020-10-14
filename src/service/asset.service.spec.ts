import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { AssetModule } from '@/module/asset.module';
import { CoreModule } from '@/core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlConfig } from '@/configuration/mysql.config';

describe('test static service', () => {
    let staticService: AssetService;
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(mysqlConfig),
                AssetModule,
                CoreModule,
            ],
        }).compile();
        staticService = module.get<AssetService>(AssetService);
    });

    it('should be defined', function () {
        expect(staticService).toBeDefined();
    });
});
