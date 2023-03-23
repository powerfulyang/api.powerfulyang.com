import { IsNotEmpty } from 'class-validator';

export class BingAIPayload {
  @IsNotEmpty()
  message: string;

  conversationSignature?: string;

  conversationId?: string;

  clientId?: string;

  invocationId?: string;
}
