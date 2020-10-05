import { Injectable } from '@nestjs/common';
import {
    PinterestInterface,
    RSSPinterestInterface,
} from 'api/pinterest-rss/pinterest.interface';
import { CoreService } from '@/core/core.service';
import { RssInterface } from '@/core/base/interface/rss.interface';

@Injectable()
export class PinterestRssService implements RssInterface {
    private readonly myRssUrl =
        'https://www.pinterest.com/powerfulyang/feed.rss';

    constructor(private coreService: CoreService) {}

    private async fetchAll(): Promise<PinterestInterface[]> {
        const json = await this.coreService.proxyFetchJsonFromRss<
            RSSPinterestInterface
        >(this.myRssUrl);
        return PinterestRssService.transform(json);
    }

    async fetchUndo(lastId?: string): Promise<PinterestInterface[]> {
        const allPosts = await this.fetchAll();
        const undoPosts = [];
        for (let i = 0; i < allPosts.length; i++) {
            if (allPosts[i].id === lastId) {
                break;
            }
            undoPosts.push(allPosts[i]);
        }
        return undoPosts;
    }

    private static transform(
        originJson: RSSPinterestInterface,
    ): PinterestInterface[] {
        const urls = originJson.rss.channel[0].item.map((x: any) => {
            // TODO to note the tip
            // ?<=  ?  ?= to get ? search
            return {
                url: x.description[0].match(/(?<=src=").+?(?=")/)[0],
                id: x.guid[0].match(/(?<=pin\/).+?(?=\/)/)[0],
            };
        });
        return urls.map((x: any) => {
            return {
                imgUrl: x.url.replace(/236x/, 'originals'),
                id: x.id,
            };
        });
    }
}
