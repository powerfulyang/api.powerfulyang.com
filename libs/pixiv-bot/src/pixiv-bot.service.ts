import { Injectable } from '@nestjs/common';
import { stringify } from 'qs';
import {
    PixivBotApiQuery,
    RESPixivInterface,
    Work,
} from 'api/pixiv-bot/pixiv.interface';
import { InstagramInterface } from 'api/instagram-bot/instagram.interface';
import { CoreService } from '@/core/core.service';
import { RssInterface } from '@/core/base/interface/rss.interface';

@Injectable()
export class PixivBotService implements RssInterface {
    private readonly pixivApiUrl =
        'https://www.pixiv.net/ajax/user/31359863/illusts/bookmarks';

    constructor(private coreService: CoreService) {}

    parseQueryUrl(
        query: PixivBotApiQuery = {
            tag: '',
            offset: 0,
            limit: 48,
            rest: 'show',
            lang: 'zh',
        },
    ) {
        return `${this.pixivApiUrl}?${stringify(query)}`;
    }

    async fetchAll() {
        const res = await this.coreService.proxyFetch(
            this.parseQueryUrl(),
            {
                headers: {
                    cookie: <string>process.env.PIXIV_BOT_COOKIE,
                },
            },
        );
        const json = await res.json();
        return PixivBotService.transform(json);
    }

    async fetchUndo(lastId?: string): Promise<any> {
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

    private static getPixivCatUrl(item: Work) {
        return new Array(item.pageCount)
            .fill(undefined)
            .map(
                (_x, i) =>
                    `https://pixiv.cat/${item.id}${
                        item.pageCount === 1 ? '' : `-${i + 1}`
                    }.jpg`,
            );
    }

    private static transform(
        originJson: RESPixivInterface,
    ): InstagramInterface[] {
        return originJson.body.works.map((item) => {
            return {
                id: item.id,
                tags: item.tags,
                imgList: PixivBotService.getPixivCatUrl(item),
            };
        });
    }
}
