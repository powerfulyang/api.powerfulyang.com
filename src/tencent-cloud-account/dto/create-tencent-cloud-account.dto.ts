import { TencentCloudAccount } from '@/tencent-cloud-account/entities/tencent-cloud-account.entity';
import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTencentCloudAccountDto extends PartialType(TencentCloudAccount) {
  @IsNotEmpty()
  declare name: string;

  @IsNotEmpty()
  declare SecretId: string;

  @IsNotEmpty()
  declare SecretKey: string;

  @IsNotEmpty()
  declare AppId: string;
}
