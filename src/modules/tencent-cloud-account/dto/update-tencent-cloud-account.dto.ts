import { PartialType } from '@nestjs/swagger';
import { CreateTencentCloudAccountDto } from './create-tencent-cloud-account.dto';

export class UpdateTencentCloudAccountDto extends PartialType(CreateTencentCloudAccountDto) {}
