import { Injectable } from '@nestjs/common';
import type { PixivBotApiQuery, RESPixivInterface, Work } from 'api/pixiv-bot/pixiv.interface.mjs';
import type { InstagramInterface } from 'api/instagram-bot/instagram.interface.mjs';
import { ProxyFetchService } from 'api/proxy-fetch/index.mjs';

@Injectable()
export class PixivBotService {
  constructor(private proxyFetchService: ProxyFetchService) {}

  private readonly pixivApiUrl = 'https://www.pixiv.net/ajax/user/31359863/illusts/bookmarks';

  private readonly defaultLimit = 48;

  private parseQueryUrl({
    offset = 0,
    limit = this.defaultLimit,
    tag = '',
    rest = 'show',
    lang = 'zh',
  }: Partial<PixivBotApiQuery>) {
    const url = new URLSearchParams({
      tag,
      offset: String(offset),
      limit: String(limit),
      rest,
      lang,
    });
    return `${this.pixivApiUrl}?${url.toString()}`;
  }

  private fetch(offset?: number) {
    return this.proxyFetchService.proxyFetchJson<RESPixivInterface>(
      this.parseQueryUrl({ offset }),
      {
        headers: {
          cookie: process.env.PIXIV_BOT_COOKIE!,
          'user-agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36`,
        },
      },
    );
  }

  async fetchUndo(lastId?: string): Promise<InstagramInterface[]> {
    const undoes: InstagramInterface[] = [];
    let offset = 0;

    let signal = true;
    do {
      const favorites = await this.fetch(offset);
      const { works } = favorites.body;
      if (favorites.error || works.length !== this.defaultLimit) {
        signal = false;
      }
      for (let i = 0; i < works.length; i++) {
        if (lastId === works[i].id) {
          signal = false;
          break;
        }
        undoes.push(PixivBotService.transform(works[i]));
      }
      offset += this.defaultLimit;
    } while (signal);

    return undoes;
  }

  private static getPixivCatUrl(item: Work) {
    return new Array(item.pageCount)
      .fill(undefined)
      .map((_x, i) => `https://pixiv.cat/${item.id}${item.pageCount === 1 ? '' : `-${i + 1}`}.jpg`);
  }

  private static transform(work: Work): InstagramInterface {
    return {
      id: work.id,
      tags: work.tags,
      imgList: PixivBotService.getPixivCatUrl(work),
      originUrl: `https://www.pixiv.net/artworks/${work.id}`,
    };
  }
}
