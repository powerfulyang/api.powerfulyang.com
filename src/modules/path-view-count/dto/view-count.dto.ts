import { ApiProperty } from '@nestjs/swagger';

export class ViewCountDto {
  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  requestCount: number;

  @ApiProperty()
  distinctIpCount: number;
}
