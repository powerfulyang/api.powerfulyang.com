import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UdpServerModule } from 'api/udp-server';
import { TencentCloudCosModule } from 'api/tencent-cloud-cos';
import { AssetModule } from '@/modules/asset/asset.module';
import { PixivScheduleService } from './pixiv-schedule/pixiv-schedule.service';
import { InstagramScheduleService } from './instagram-schedule/instagram-schedule.service';
import { PinterestScheduleService } from './pinterest-schedule/pinterest-schedule.service';
import { UdpScheduleService } from './udp-schedule/udp-schedule.service';
import { CosObjectUrlScheduleService } from './cos-object-url-schedule/cos-object-url-schedule.service';

@Module({
  imports: [ScheduleModule.forRoot(), UdpServerModule, AssetModule, TencentCloudCosModule],
  providers: [
    PixivScheduleService,
    InstagramScheduleService,
    PinterestScheduleService,
    UdpScheduleService,
    CosObjectUrlScheduleService,
  ],
  exports: [
    PixivScheduleService,
    InstagramScheduleService,
    PinterestScheduleService,
    UdpScheduleService,
    CosObjectUrlScheduleService,
  ],
})
export class SchedulesModule {}
