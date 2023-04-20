import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChatGPTPayload {
  @IsNotEmpty()
  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  parentMessageId?: string;

  @ApiPropertyOptional()
  conversationId?: string;
}
