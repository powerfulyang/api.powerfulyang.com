import { AssetModule } from '@/asset/asset.module';
import { CoreModule } from '@/core/core.module';
import { CosObjectUrlScheduleService } from '@/schedule/cos-object-url-schedule/cos-object-url-schedule.service';
import { InstagramScheduleService } from '@/schedule/instagram-schedule/instagram-schedule.service';
import { PinterestScheduleService } from '@/schedule/pinterest-schedule/pinterest-schedule.service';
import { PixivScheduleService } from '@/schedule/pixiv-schedule/pixiv-schedule.service';
import { TencentCloudAccountModule } from '@/tencent-cloud-account/tencent-cloud-account.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { LoggerModule } from '@/common/logger/logger.module';
import { ScheduleModule as _SchedulesModule } from '@nestjs/schedule';
import { ScheduleController } from './schedule.controller';

@Module({
  imports: [
    LoggerModule,
    _SchedulesModule.forRoot(),
    AssetModule,
    TencentCloudAccountModule,
    LoggerModule,
    CoreModule,
    UserModule,
  ],
  providers: [
    PixivScheduleService,
    InstagramScheduleService,
    PinterestScheduleService,
    CosObjectUrlScheduleService,
  ],
  exports: [
    PixivScheduleService,
    InstagramScheduleService,
    PinterestScheduleService,
    CosObjectUrlScheduleService,
  ],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
