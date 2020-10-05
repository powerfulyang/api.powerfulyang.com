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

    it('bot send message', async function () {
        await expect(
            service.sendToMe('我是机器人'),
        ).resolves.toHaveProperty('text', '我是机器人');
    });
});
