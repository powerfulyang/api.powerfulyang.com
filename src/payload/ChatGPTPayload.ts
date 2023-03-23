import { IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChatGPTPayload {
  @IsNotEmpty()
  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  parentMessageId?: string;

  @ApiPropertyOptional()
  conversationId?: string;
}
