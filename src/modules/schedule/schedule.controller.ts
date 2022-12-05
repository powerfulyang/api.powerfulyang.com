import { Controller, ForbiddenException, Get, Param } from '@nestjs/common';
import { PixivScheduleService } from '@/schedules/pixiv-schedule/pixiv-schedule.service';
import { InstagramScheduleService } from '@/schedules/instagram-schedule/instagram-schedule.service';
import { PinterestScheduleService } from '@/schedules/pinterest-schedule/pinterest-schedule.service';
import { AdminAuthGuard } from '@/common/decorator/auth-guard';
import { UdpScheduleService } from '@/schedules/udp-schedule/udp-schedule.service';
import { CosObjectUrlScheduleService } from '@/schedules/cos-object-url-schedule/cos-object-url-schedule.service';
import { ScheduleType } from '@/enum/ScheduleType';
import { ApiTags } from '@nestjs/swagger';

@Controller('schedule')
@ApiTags('schedule')
@AdminAuthGuard()
export class ScheduleController {
  constructor(
    private pixivScheduleService: PixivScheduleService,
    private instagramScheduleService: InstagramScheduleService,
    private pinterestScheduleService: PinterestScheduleService,
    private udpScheduleService: UdpScheduleService,
    private cosObjectUrlScheduleService: CosObjectUrlScheduleService,
  ) {}

  @Get(':scheduleType')
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
      case ScheduleType.udp:
        this.udpScheduleService.healthCheck();
        break;
      case ScheduleType.cosObjectUrlRefresh:
        await this.cosObjectUrlScheduleService.main();
        break;
      default:
        throw new ForbiddenException();
    }
    return 'action success';
  }
}
