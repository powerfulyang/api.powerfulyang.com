import { ApiProperty } from '@nestjs/swagger';
import type { CosBucket } from '@/bucket/entities/bucket.entity';

export type UploadFileMsg = { sha1: string; suffix: string } & Pick<CosBucket, 'name'>;

export class UploadAssetsDto {
  @ApiProperty({ type: 'array', items: { type: 'file', format: 'binary' } })
  assets?: UploadFile[];
}

export type UploadFile = {
  filename: string;
  encoding: string;
  mimetype: string;
  data: Buffer;
  limit?: boolean;
};
