import { ApiProperty } from '@nestjs/swagger';

export class RequestLogDto {
  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  requestCount: number;

  @ApiProperty()
  distinctIpCount: number;
}
