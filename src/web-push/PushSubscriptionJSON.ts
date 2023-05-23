import { ApiProperty } from '@nestjs/swagger';

export class PushSubscriptionJSON {
  @ApiProperty({
    required: false,
  })
  endpoint: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  expirationTime?: number;

  @ApiProperty({
    required: false,
  })
  keys: {
    p256dh: string;
    auth: string;
  };
}
