import { Test, TestingModule } from '@nestjs/testing';
import { PixivBotService } from './pixiv-bot.service';
import { PixivBotModule } from 'api/pixiv-bot/pixiv-bot.module';

describe('PixivRssService', () => {
    let service: PixivBotService;

    beforeEach(async () => {
        jest.setTimeout(100000);
        const module: TestingModule = await Test.createTestingModule({
            imports: [PixivBotModule],
        }).compile();

        service = module.get<PixivBotService>(PixivBotService);
    });

    it('test querystring', function () {
        expect(service.parseQueryUrl()).toBe(
            'https://www.pixiv.net/ajax/user/31359863/illusts/bookmarks?tag=&offset=0&limit=48&rest=show&lang=zh',
        );
    });

    it('should be defined', async () => {
        await expect(
            service
                .fetchUndo('73500666')
                .then((res) => res.pop()!.id),
        ).resolves.toBe('84710311');
    });
});
