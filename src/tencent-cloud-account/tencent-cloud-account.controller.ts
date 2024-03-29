import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { CreateTencentCloudAccountDto } from '@/tencent-cloud-account/dto/create-tencent-cloud-account.dto';
import { TencentCloudAccountService } from './tencent-cloud-account.service';

@Controller('tencent-cloud-account')
@AdminAuthGuard()
@ApiTags('tencent-cloud-account')
export class TencentCloudAccountController {
  constructor(private readonly tencentCloudAccountService: TencentCloudAccountService) {}

  @Post()
  @ApiOperation({
    summary: '新增腾讯云账号',
    operationId: 'addTencentCloudAccount',
  })
  addAccount(@Body() account: CreateTencentCloudAccountDto) {
    return this.tencentCloudAccountService.create(account);
  }
}
