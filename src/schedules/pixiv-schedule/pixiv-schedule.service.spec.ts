import { Test, TestingModule } from '@nestjs/testing';
import { PixivScheduleService } from './pixiv-schedule.service';

describe('PixivScheduleService', () => {
    let service: PixivScheduleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PixivScheduleService],
        }).compile();

        service = module.get<PixivScheduleService>(
            PixivScheduleService,
        );
    });

    it('should be defined', async () => {
        expect(service.bot()).toBeUndefined();
    });
});
