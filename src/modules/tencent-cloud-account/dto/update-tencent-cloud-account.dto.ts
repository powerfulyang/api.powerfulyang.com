import { PartialType } from '@nestjs/mapped-types';
import { CreateTencentCloudAccountDto } from './create-tencent-cloud-account.dto';

export class UpdateTencentCloudAccountDto extends PartialType(CreateTencentCloudAccountDto) {}
