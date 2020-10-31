import { Test, TestingModule } from '@nestjs/testing';
import { CosObjectUrlScheduleService } from './cos-object-url-schedule.service';

describe('CosObjectUrlScheduleService', () => {
    let service: CosObjectUrlScheduleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CosObjectUrlScheduleService],
        }).compile();

        service = module.get<CosObjectUrlScheduleService>(
            CosObjectUrlScheduleService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
