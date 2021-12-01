import { Injectable } from '@nestjs/common';
import { TelegramBotService } from 'api/telegram-bot/index.mjs';
import type { Payload } from './github.interfaces.mjs';
import { EventType } from './github.enum.mjs';
import type { WebhookPayload } from './payload/webhook-payload.mjs';

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
      default: {
        return this.sendToMe(payload, type);
      }
    }
  }
}
