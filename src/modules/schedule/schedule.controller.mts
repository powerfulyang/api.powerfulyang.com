import { Controller, ForbiddenException, Get, Param } from '@nestjs/common';
import { PixivScheduleService } from '@/schedules/pixiv-schedule/pixiv-schedule.service.mjs';
import { InstagramScheduleService } from '@/schedules/instagram-schedule/instagram-schedule.service.mjs';
import { PinterestScheduleService } from '@/schedules/pinterest-schedule/pinterest-schedule.service.mjs';
import { AdminAuthGuard, JwtAuthGuard } from '@/common/decorator/auth-guard.decorator.mjs';
import { SUCCESS } from '@/constants/constants.mjs';
import { UdpScheduleService } from '@/schedules/udp-schedule/udp-schedule.service.mjs';
import { CosObjectUrlScheduleService } from '@/schedules/cos-object-url-schedule/cos-object-url-schedule.service.mjs';
import { ScheduleType } from '@/enum/ScheduleType.mjs';

@Controller('schedule')
@JwtAuthGuard()
export class ScheduleController {
  constructor(
    private pixivScheduleService: PixivScheduleService,
    private instagramScheduleService: InstagramScheduleService,
    private pinterestScheduleService: PinterestScheduleService,
    private udpScheduleService: UdpScheduleService,
    private cosObjectUrlScheduleService: CosObjectUrlScheduleService,
  ) {}

  @Get(':scheduleType')
  @AdminAuthGuard()
  async RunScheduleByRequest(
    @Param('scheduleType')
    scheduleType: ScheduleType,
  ) {
    switch (scheduleType) {
      case ScheduleType.instagram:
        await this.instagramScheduleService.bot();
        break;
      case ScheduleType.pinterest:
        await this.pinterestScheduleService.bot();
        break;
      case ScheduleType.pixiv:
        await this.pixivScheduleService.bot();
        break;
      case ScheduleType.udp:
        await this.udpScheduleService.healthCheck();
        break;
      case ScheduleType.cosObjectUrlRefresh:
        await this.cosObjectUrlScheduleService.refreshObjectUrl();
        break;
      default:
        throw new ForbiddenException();
    }
    return SUCCESS;
  }
}
