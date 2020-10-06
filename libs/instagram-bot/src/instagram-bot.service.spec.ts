import { Test, TestingModule } from '@nestjs/testing';
import { InstagramBotService } from './instagram-bot.service';
import { InstagramBotModule } from 'api/instagram-bot/instagram-bot.module';
import { ProxyFetchModule } from 'api/proxy-fetch';

describe('InstagramBotService', () => {
    let service: InstagramBotService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ProxyFetchModule, InstagramBotModule],
        }).compile();

        service = module.get<InstagramBotService>(
            InstagramBotService,
        );
    });

    it('should fetch all saved be defined', async () => {
        await expect(
            service.fetchUndo().then((res) => res.pop()!.id),
        ).resolves.toBe('2210206425515440308_8404550374');
    });

    it('should fetch undo saved be defined', async () => {
        await expect(
            service
                .fetchUndo('2210206425515440308_8404550374')
                .then((res) => res.pop()!.id),
        ).resolves.toBe('2215773060626406515_25727629870');
    });
});
