import { Body, Controller, Post } from '@nestjs/common';
import { TencentCloudAccountService } from './tencent-cloud-account.service';
import { AdminAuthGuard, JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { TencentCloudAccount } from '@/modules/tencent-cloud-account/entities/tencent-cloud-account.entity';

@Controller('tencent-cloud-account')
@JwtAuthGuard()
export class TencentCloudAccountController {
  constructor(private readonly tencentCloudAccountService: TencentCloudAccountService) {}

  @Post()
  @AdminAuthGuard()
  addNewAccount(@Body() account: TencentCloudAccount) {
    return this.tencentCloudAccountService.create(account);
  }
}
