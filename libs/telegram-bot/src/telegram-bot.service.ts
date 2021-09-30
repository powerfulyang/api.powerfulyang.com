import { Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { ProxyFetchService } from 'api/proxy-fetch';
import { interval, tap } from 'rxjs';

@Injectable()
export class TelegramBotService {
  private bot?: TelegramBot;

  private readonly token = process.env.TELEGRAM_BOT_TOKEN!;

  private readonly MY_CHAT_ID = Number(process.env.MY_CHAT_ID);

  constructor(private proxyFetchService: ProxyFetchService) {
    this.initBot();
    this.loop();
  }

  private messages: [number, string][] = [];

  initBot() {
    if (!this.bot) {
      this.bot = new TelegramBot(this.token, {
        request: <any>{
          agent: this.proxyFetchService.getAgent(),
        },
      });
    }
  }

  async sendMessage(chatId: number, msg: string) {
    return this.messages.push([chatId, msg]);
  }

  async sendToMe(msg: string) {
    return this.sendMessage(this.MY_CHAT_ID, msg);
  }

  loop() {
    interval(1000)
      .pipe(
        tap(() => {
          const item = this.messages.pop();
          if (item) {
            const [chatId, msg] = item;
            return this.bot!.sendMessage(chatId, msg);
          }
          return 0;
        }),
      )
      .subscribe();
  }
}
