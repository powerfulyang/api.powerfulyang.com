import { Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { ProxyFetchService } from 'api/proxy-fetch';

@Injectable()
export class TelegramBotService {
  private readonly bot?: TelegramBot;

  private readonly token = process.env.TELEGRAM_BOT_TOKEN;

  private readonly MY_CHAT_ID = Number(process.env.MY_CHAT_ID);

  constructor(private proxyFetchService: ProxyFetchService) {
    this.bot = new TelegramBot(this.token, {
      polling: true,
      request: <any>{
        agent: this.proxyFetchService.agent,
      },
    });
  }

  async sendMessage(chatId: number, msg: string) {
    return this.bot!.sendMessage(chatId, msg);
  }

  async sendToMe(msg: string) {
    return this.sendMessage(this.MY_CHAT_ID, msg);
  }
}
