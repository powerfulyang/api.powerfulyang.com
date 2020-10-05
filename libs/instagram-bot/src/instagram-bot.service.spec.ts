import { Test, TestingModule } from '@nestjs/testing';
import { InstagramBotService } from './instagram-bot.service';

describe('InstagramBotService', () => {
    let service: InstagramBotService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [InstagramBotService],
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
