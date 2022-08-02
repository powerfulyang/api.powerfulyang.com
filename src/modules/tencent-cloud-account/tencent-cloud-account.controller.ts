import { Body, Controller, Post } from '@nestjs/common';
import { AdminAuthGuard } from '@/common/decorator';
import { CreateTencentCloudAccountDto } from '@/modules/tencent-cloud-account/dto/create-tencent-cloud-account.dto';
import { TencentCloudAccountService } from './tencent-cloud-account.service';

@Controller('tencent-cloud-account')
@AdminAuthGuard()
export class TencentCloudAccountController {
  constructor(private readonly tencentCloudAccountService: TencentCloudAccountService) {}

  @Post()
  addNewAccount(@Body() account: CreateTencentCloudAccountDto) {
    return this.tencentCloudAccountService.create(account);
  }
}
