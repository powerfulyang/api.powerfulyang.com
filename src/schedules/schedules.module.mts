import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UdpServerModule } from 'api/udp-server/index.mjs';
import { AssetModule } from '@/modules/asset/asset.module.mjs';
import { PixivScheduleService } from './pixiv-schedule/pixiv-schedule.service.mjs';
import { InstagramScheduleService } from './instagram-schedule/instagram-schedule.service.mjs';
import { PinterestScheduleService } from './pinterest-schedule/pinterest-schedule.service.mjs';
import { UdpScheduleService } from './udp-schedule/udp-schedule.service.mjs';
import { CosObjectUrlScheduleService } from './cos-object-url-schedule/cos-object-url-schedule.service.mjs';
import { TencentCloudAccountModule } from '@/modules/tencent-cloud-account/tencent-cloud-account.module.mjs';

@Module({
  imports: [ScheduleModule.forRoot(), UdpServerModule, AssetModule, TencentCloudAccountModule],
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
