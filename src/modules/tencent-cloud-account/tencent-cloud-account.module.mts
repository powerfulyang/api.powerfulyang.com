import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TencentCloudAccountService } from './tencent-cloud-account.service.mjs';
import { TencentCloudAccountController } from './tencent-cloud-account.controller.mjs';
import { TencentCloudAccount } from '@/modules/tencent-cloud-account/entities/tencent-cloud-account.entity.mjs';

@Module({
  imports: [TypeOrmModule.forFeature([TencentCloudAccount])],
  controllers: [TencentCloudAccountController],
  providers: [TencentCloudAccountService],
  exports: [TencentCloudAccountService],
})
export class TencentCloudAccountModule {}
