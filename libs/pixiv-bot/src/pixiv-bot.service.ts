import { Injectable } from '@nestjs/common';
import { stringify } from 'qs';
import {
    RESPixivInterface,
    Work,
} from 'api/pixiv-bot/pixiv.interface';
import { InstagramInterface } from 'api/instagram-bot/instagram.interface';
import { ProxyFetchService } from 'api/proxy-fetch';

@Injectable()
export class PixivBotService {
    constructor(private proxyFetchService: ProxyFetchService) {}

    private readonly pixivApiUrl =
        'https://www.pixiv.net/ajax/user/31359863/illusts/bookmarks';

    private readonly defaultLimit = 48;

    private parseQueryUrl(
        offset = 0,
        limit = this.defaultLimit,
        tag = '',
        rest = 'show',
        lang = 'zh',
    ) {
        return `${this.pixivApiUrl}?${stringify({
            tag,
            offset,
            limit,
            rest,
            lang,
        })}`;
    }

    private fetch(offset?: number) {
        return this.proxyFetchService.proxyFetchJson<
            RESPixivInterface
        >(this.parseQueryUrl(offset), {
            headers: {
                cookie: process.env.PIXIV_BOT_COOKIE,
            },
        });
    }

    async fetchUndo(lastId?: string): Promise<InstagramInterface[]> {
        const undoes: InstagramInterface[] = [];
        let offset = 0;

        let signal = true;
        do {
            const favorites = await this.fetch(offset);
            const { works } = favorites.body;
            if (
                favorites.error ||
                works.length !== this.defaultLimit
            ) {
                signal = false;
            }
            for (let i = 0; i < works.length; i++) {
                if (lastId === works[i].id) {
                    signal = false;
                    break;
                }
                undoes.push(PixivBotService.transform(works[i]));
            }
            offset++;
        } while (signal);

        return undoes;
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

    private static transform(work: Work): InstagramInterface {
        return {
            id: work.id,
            tags: work.tags,
            imgList: PixivBotService.getPixivCatUrl(work),
        };
    }
}
