import { Test, TestingModule } from '@nestjs/testing';
import { PinterestRssService } from './pinterest-rss.service';
import { PinterestRssModule } from 'api/pinterest-rss/pinterest-rss.module';

describe('PinterestRssService', () => {
    let service: PinterestRssService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PinterestRssModule],
        }).compile();

        service = module.get<PinterestRssService>(
            PinterestRssService,
        );
    });

    it('should get undo posts', async () => {
        await expect(
            service
                .fetchUndo('836262224552035684')
                .then((res) => res.pop()?.id),
        ).resolves.toStrictEqual('836262224552037400');
    });
});
