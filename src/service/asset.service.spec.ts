import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { AssetModule } from '@/module/asset.module';
import { CoreModule } from '@/core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '@/mysql/config';

describe('test static service', () => {
    let staticService: AssetService;
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(config),
                AssetModule,
                CoreModule,
            ],
        }).compile();
        staticService = module.get<AssetService>(AssetService);
    });

    it('test make waiting for the completion of actions, then receive a new message', function () {
        staticService.sendMsg('test');
        staticService.sendMsg('test2');
    });
});
