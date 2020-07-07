import { Test, TestingModule } from '@nestjs/testing';
import { TelegramBotService } from './telegram-bot.service';

describe('TelegramBotService', () => {
    let service: TelegramBotService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TelegramBotService],
        }).compile();

        service = module.get<TelegramBotService>(TelegramBotService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('bot receive message', async function () {
        const chatId = await new Promise((resolve) => {
            service.getBot().on('message', (msg) => {
                resolve(msg.chat.id);
            });
        });
        expect(chatId).toBe(Number(process.env.MY_CHAT_ID));
    });

    it('bot send message', async function () {
        await expect(service.sendToMe('111')).resolves.toHaveProperty('text', '111');
    });
});
