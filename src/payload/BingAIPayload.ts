import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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
