import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UdpServerModule } from 'api/udp-server';
import { AssetModule } from '@/modules/asset/asset.module';
import { PixivScheduleService } from './pixiv-schedule/pixiv-schedule.service';
import { InstagramScheduleService } from './instagram-schedule/instagram-schedule.service';
import { PinterestScheduleService } from './pinterest-schedule/pinterest-schedule.service';
import { UdpScheduleService } from './udp-schedule/udp-schedule.service';
import { CosObjectUrlScheduleService } from './cos-object-url-schedule/cos-object-url-schedule.service';
import { TencentCloudAccountModule } from '@/modules/tencent-cloud-account/tencent-cloud-account.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { CoreModule } from '@/core/core.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), // 其实可以选择禁用。
    UdpServerModule,
    AssetModule,
    TencentCloudAccountModule,
    LoggerModule,
    CoreModule,
  ],
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
