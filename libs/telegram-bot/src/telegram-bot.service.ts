import { Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramBotService {
    private readonly bot: TelegramBot;
    private readonly token = <string>process.env.TELEGRAM_BOT_TOKEN;
    private readonly MY_CHAT_ID = Number(process.env.MY_CHAT_ID);
    constructor() {
        this.bot = new TelegramBot(this.token, { polling: true });
    }

    getBot() {
        return this.bot;
    }

    async sendMessage(chatId: number, msg: string) {
        return await this.bot.sendMessage(chatId, msg);
    }

    async sendToMe(msg: string) {
        return this.sendMessage(this.MY_CHAT_ID, msg);
    }
}
