import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TencentCloudAccountService } from './tencent-cloud-account.service';
import { TencentCloudAccountController } from './tencent-cloud-account.controller';
import { TencentCloudAccount } from '@/modules/tencent-cloud-account/entities/tencent-cloud-account.entity';
import { OrmModule } from '@/common/ORM/orm.module';

@Module({
  imports: [OrmModule, TypeOrmModule.forFeature([TencentCloudAccount])],
  controllers: [TencentCloudAccountController],
  providers: [TencentCloudAccountService],
  exports: [TencentCloudAccountService],
})
export class TencentCloudAccountModule {}
