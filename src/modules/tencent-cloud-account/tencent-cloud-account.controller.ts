import { Body, Controller, Post } from '@nestjs/common';
import { TencentCloudAccountService } from './tencent-cloud-account.service';
import { AdminAuthGuard, JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { CreateTencentCloudAccountDto } from '@/modules/tencent-cloud-account/dto/create-tencent-cloud-account.dto';

@Controller('tencent-cloud-account')
@JwtAuthGuard()
export class TencentCloudAccountController {
  constructor(private readonly tencentCloudAccountService: TencentCloudAccountService) {}

  @Post()
  @AdminAuthGuard()
  addNewAccount(@Body() account: CreateTencentCloudAccountDto) {
    return this.tencentCloudAccountService.create(account);
  }
}
