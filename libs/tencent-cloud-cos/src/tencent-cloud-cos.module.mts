import { Module } from '@nestjs/common';
import { TencentCloudCosService } from './tencent-cloud-cos.service.mjs';

@Module({
  providers: [TencentCloudCosService],
  exports: [TencentCloudCosService],
})
export class TencentCloudCosModule {}
