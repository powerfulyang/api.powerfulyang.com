import { Injectable } from '@nestjs/common';
import { ProxyFetchService } from 'api/proxy-fetch';
import TelegramBot from 'node-telegram-bot-api';
import process from 'node:process';
import { interval, map } from 'rxjs';

/**
 * @deprecated
 * 不再经常用
 */
@Injectable()
export class TelegramBotService {
  private bot?: TelegramBot;

  private readonly token = process.env.TELEGRAM_BOT_TOKEN!;

  private readonly MY_CHAT_ID = Number(process.env.MY_CHAT_ID);

  private messages: [number, string][] = [];

  constructor(private proxyFetchService: ProxyFetchService) {
    this.initBot();
    // this.loop();
  }

  initBot() {
    /**
     * 写了 token 的时候才会自动初始化 bot
     */
    if (!this.bot && this.token) {
      this.bot = new TelegramBot(this.token, {
        request: <any>{
          agent: this.proxyFetchService.getAgent(),
        },
      });
    }
  }

  sendMessage(chatId: number, msg: string) {
    return this.messages.push([chatId, msg]);
  }

  sendToMe(msg: string) {
    return this.sendMessage(this.MY_CHAT_ID, msg);
  }

  loop() {
    interval(1000)
      .pipe(
        map(() => {
          return this.messages.pop();
        }),
      )
      .subscribe(async (item) => {
        if (item) {
          const [chatId, msg] = item;
          await this.bot?.sendMessage(chatId, msg);
        }
      });
  }
}
