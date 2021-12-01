import { Test, TestingModule } from '@nestjs/testing';
import { PixivScheduleService } from './pixiv-schedule.service.mjs';
import { AppModule } from '@/app.module.mjs';
import { SUCCESS } from '../../constants/constants.mjs';

describe('PixivScheduleService', () => {
  let service: PixivScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<PixivScheduleService>(PixivScheduleService);
  });

  it('should be defined', async () => {
    await expect(service.bot()).resolves.toBe(SUCCESS);
  });
});
