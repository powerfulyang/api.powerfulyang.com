import { Injectable } from '@nestjs/common';
import { TelegramBotService } from 'api/telegram-bot';
import { Payload } from './github.interfaces';
import { EventType } from './github.enum';
import { WebhookPayload } from './payload/webhook-payload';

@Injectable()
export class GithubService {
  constructor(private telegramBotService: TelegramBotService) {}

  private async sendToMe<T extends WebhookPayload>(payload: Payload<T>, type: EventType) {
    return this.telegramBotService.sendToMe(
      `${EventType[type]} Change\nAction: ${payload.action}\nRepository: ${payload.repository?.full_name}`,
    );
  }

  dealWebHook<T extends WebhookPayload>(payload: Payload<T>, type: EventType) {
    switch (type) {
      // TODO
      default: {
        return this.sendToMe(payload, type);
      }
    }
  }
}
