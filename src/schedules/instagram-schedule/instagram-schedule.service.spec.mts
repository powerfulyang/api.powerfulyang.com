import { Test, TestingModule } from '@nestjs/testing';
import { InstagramScheduleService } from './instagram-schedule.service.mjs';
import { AppModule } from '@/app.module.mjs';
import { SUCCESS } from '../../constants/constants.mjs';

describe('InstagramScheduleService', () => {
  let service: InstagramScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<InstagramScheduleService>(InstagramScheduleService);
  });

  it('should be defined', async () => {
    await expect(service.bot()).resolves.toBe(SUCCESS);
  });
});
