import type { UploadFile } from '@/type/UploadFile';
import { ApiProperty } from '@nestjs/swagger';

export class OCRDto {
  @ApiProperty({ type: 'array', items: { type: 'file', format: 'binary' } })
  images: UploadFile[];

  @ApiProperty()
  language?: string;
}
