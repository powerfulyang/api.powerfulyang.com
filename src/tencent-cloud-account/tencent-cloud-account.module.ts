import { LoggerModule } from '@/common/logger/logger.module';
import { OrmModule } from '@/service/typeorm/orm.module';
import { TencentCloudAccount } from '@/tencent-cloud-account/entities/tencent-cloud-account.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TencentCloudAccountController } from './tencent-cloud-account.controller';
import { TencentCloudAccountService } from './tencent-cloud-account.service';

@Module({
  imports: [OrmModule, TypeOrmModule.forFeature([TencentCloudAccount]), LoggerModule],
  controllers: [TencentCloudAccountController],
  providers: [TencentCloudAccountService],
  exports: [TencentCloudAccountService],
})
export class TencentCloudAccountModule {}
