import { IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BingAIPayload {
  @IsNotEmpty()
  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  conversationSignature?: string;

  @ApiPropertyOptional()
  conversationId?: string;

  @ApiPropertyOptional()
  clientId?: string;

  @ApiPropertyOptional()
  invocationId?: string;
}
