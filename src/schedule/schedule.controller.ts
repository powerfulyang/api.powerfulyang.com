import { Controller, ForbiddenException, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { ScheduleType } from '@/enum/ScheduleType';
import { CosObjectUrlScheduleService } from '@/schedule/cos-object-url-schedule/cos-object-url-schedule.service';
import { InstagramScheduleService } from '@/schedule/instagram-schedule/instagram-schedule.service';
import { PinterestScheduleService } from '@/schedule/pinterest-schedule/pinterest-schedule.service';
import { PixivScheduleService } from '@/schedule/pixiv-schedule/pixiv-schedule.service';

@Controller('schedule')
@ApiTags('schedule')
@AdminAuthGuard()
export class ScheduleController {
  constructor(
    private pixivScheduleService: PixivScheduleService,
    private instagramScheduleService: InstagramScheduleService,
    private pinterestScheduleService: PinterestScheduleService,
    private cosObjectUrlScheduleService: CosObjectUrlScheduleService,
  ) {}

  @Get(':scheduleType')
  @ApiOperation({
    summary: '手动触发定时任务',
    operationId: 'triggerSchedule',
  })
  async RunScheduleByRequest(
    @Param('scheduleType')
    scheduleType: ScheduleType,
  ) {
    switch (scheduleType) {
      case ScheduleType.instagram:
        this.instagramScheduleService.main();
        break;
      case ScheduleType.pinterest:
        this.pinterestScheduleService.main();
        break;
      case ScheduleType.pixiv:
        this.pixivScheduleService.main();
        break;
      case ScheduleType.cosObjectUrlRefresh:
        await this.cosObjectUrlScheduleService.main();
        break;
      default:
        throw new ForbiddenException('scheduleType not found');
    }
    return 'action success';
  }
}
