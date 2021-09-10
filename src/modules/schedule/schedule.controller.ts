import { Controller, ForbiddenException, Get, Param } from '@nestjs/common';
import { PixivScheduleService } from '@/schedules/pixiv-schedule/pixiv-schedule.service';
import { InstagramScheduleService } from '@/schedules/instagram-schedule/instagram-schedule.service';
import { PinterestScheduleService } from '@/schedules/pinterest-schedule/pinterest-schedule.service';
import { AssetBucket } from '@/enum/AssetBucket';
import {AdminAuthGuard, JwtAuthGuard} from '@/common/decorator/auth-guard.decorator';
import { SUCCESS } from '@/constants/constants';
import { OtherSchedule } from '@/enum/OtherSchedule';
import { UdpScheduleService } from '@/schedules/udp-schedule/udp-schedule.service';
import { CosObjectUrlScheduleService } from '@/schedules/cos-object-url-schedule/cos-object-url-schedule.service';

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
    scheduleType: AssetBucket & OtherSchedule,
  ) {
    switch (scheduleType) {
      case AssetBucket.instagram:
        await this.instagramScheduleService.bot();
        break;
      case AssetBucket.pinterest:
        await this.pinterestScheduleService.bot();
        break;
      case AssetBucket.pixiv:
        await this.pixivScheduleService.bot();
        break;
      case OtherSchedule.udp:
        await this.udpScheduleService.healthCheck();
        break;
      case OtherSchedule.cosObjectUrlRefresh:
        await this.cosObjectUrlScheduleService.refreshObjectUrl();
        break;
      default:
        throw new ForbiddenException();
    }
    return SUCCESS;
  }
}
