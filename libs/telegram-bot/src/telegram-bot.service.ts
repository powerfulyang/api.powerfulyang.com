import { Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';

const Agent = require('socks5-https-client/lib/Agent');

@Injectable()
export class TelegramBotService {
    readonly bot?: TelegramBot;

    private readonly token = <string>process.env.TELEGRAM_BOT_TOKEN;

    private readonly MY_CHAT_ID = Number(process.env.MY_CHAT_ID);

    constructor() {
        if (process.env.TELEGRAM_BOT_BAN_POLLING) {
            return;
        }
        if (
            process.env.BOT_SOCKS5_PROXY_HOST ||
            process.env.BOT_SOCKS5_PROXY_PORT
        ) {
            this.bot = new TelegramBot(this.token, {
                polling: true,
                request: {
                    agentClass: Agent,
                    agentOptions: {
                        socksHost: process.env.BOT_SOCKS5_PROXY_HOST,
                        socksPort: Number(
                            process.env.BOT_SOCKS5_PROXY_PORT,
                        ),
                    },
                } as any,
            });
        } else {
            this.bot = new TelegramBot(this.token, { polling: true });
        }
    }

    async sendMessage(chatId: number, msg: string) {
        return this.bot!.sendMessage(chatId, msg);
    }

    async sendToMe(msg: string) {
        return this.sendMessage(this.MY_CHAT_ID, msg);
    }
}
