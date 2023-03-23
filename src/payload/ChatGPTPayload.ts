import { IsNotEmpty } from 'class-validator';

export class ChatGPTPayload {
  @IsNotEmpty()
  message: string;

  parentMessageId?: string;

  conversationId?: string;
}
