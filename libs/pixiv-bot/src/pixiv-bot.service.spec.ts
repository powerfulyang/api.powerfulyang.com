import { Test, TestingModule } from '@nestjs/testing';
import { PixivBotService } from './pixiv-bot.service';
import { PixivBotModule } from 'api/pixiv-bot/pixiv-bot.module';
import { CoreModule } from '@/core/core.module';

describe('PixivRssService', () => {
    let service: PixivBotService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CoreModule, PixivBotModule],
        }).compile();

        service = module.get<PixivBotService>(PixivBotService);
    });

    it('should be defined', async () => {
        await expect(
            service
                .fetchUndo('73500666')
                .then((res) => res.pop()!.id),
        ).resolves.toBe('84710311');
    });
});
