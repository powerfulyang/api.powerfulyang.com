import { ApiProperty } from '@nestjs/swagger';
import type { UploadFile } from '@/type/UploadFile';

export class OCRDto {
  @ApiProperty({ type: 'array', items: { type: 'file', format: 'binary' } })
  images: UploadFile[];

  // @ApiProperty()
  language?: string;
}
