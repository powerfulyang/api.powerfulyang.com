import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/user/user.module';
import { SchedulesModule } from '@/schedules/schedules.module';
import { PathViewCountModule } from '@/modules/path.view.count/path.view.count.module';
import { BootstrapService } from '@/core/bootstrap/bootstrap.service';

@Module({
  imports: [UserModule, SchedulesModule, PathViewCountModule],
  providers: [BootstrapService],
  exports: [BootstrapService],
})
export class BootstrapModule {}
