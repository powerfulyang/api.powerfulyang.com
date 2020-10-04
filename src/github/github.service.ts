import { Injectable } from '@nestjs/common';
import { TelegramBotService } from 'api/telegram-bot';
import { Payload } from './github.interfaces';
import { EventType } from './github.enum';
import { WebhookPayload } from './payload/webhook-payload';

@Injectable()
export class GithubService {
    constructor(private chatBotService: TelegramBotService) {}

    public async sendMsg<T extends WebhookPayload>(
        payload: Payload<T>,
        type: EventType,
    ) {
        return this.chatBotService.sendToMe(
            `${EventType[type]} Change\nAction: ${payload.action}\nRepository: ${payload.repository?.full_name}`,
        );
    }

    dealWebHook<T extends WebhookPayload>(
        payload: Payload<T>,
        type: EventType,
    ) {
        switch (type) {
            case EventType.issues: {
                return this.sendMsg(payload, type);
            }
            default: {
                return this.sendMsg(payload, type);
            }
        }
    }
}
