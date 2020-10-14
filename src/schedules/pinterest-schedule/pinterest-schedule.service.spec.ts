import { Test, TestingModule } from '@nestjs/testing';
import { PinterestScheduleService } from './pinterest-schedule.service';
import { SUCCESS } from '@/constants/constants';
import { AppModule } from '@/app.module';

describe('PinterestScheduleService', () => {
    let service: PinterestScheduleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = module.get<PinterestScheduleService>(
            PinterestScheduleService,
        );
    });

    it('should be defined', async () => {
        await expect(service.bot()).resolves.toBe(SUCCESS);
    });
});
