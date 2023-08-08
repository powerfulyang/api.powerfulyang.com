import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from '@/common/logger/logger.module';
import { CoreModule } from '@/core/core.module';
import { AssetModule } from '@/asset/asset.module';
import { TencentCloudAccountModule } from '@/tencent-cloud-account/tencent-cloud-account.module';
import { UserModule } from '@/user/user.module';
import { CosObjectUrlScheduleService } from './cos-object-url-schedule/cos-object-url-schedule.service';
import { InstagramScheduleService } from './instagram-schedule/instagram-schedule.service';
import { PinterestScheduleService } from './pinterest-schedule/pinterest-schedule.service';
import { PixivScheduleService } from './pixiv-schedule/pixiv-schedule.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), // 其实可以选择禁用。
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
})
export class SchedulesModule {}
