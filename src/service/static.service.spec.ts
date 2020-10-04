import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticService } from './static.service';
import { StaticModule } from '../module/static.module';
import mysqlConfig from '../config';

describe('test static service', () => {
    let staticService: StaticService;
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(mysqlConfig),
                StaticModule,
            ],
        }).compile();
        staticService = module.get<StaticService>(StaticService);
    });

    it('test make waiting for the completion of actions, then receive a new message', function () {
        staticService.sendMsg('test');
        staticService.sendMsg('test2');
    });
});
