import { LoggerService } from '@/common/logger/logger.service';
import { pixivCookieFilePath } from '@/constants/cookie-path';
import { readFileSync, writeFileSync } from 'node:fs';
import { Injectable } from '@nestjs/common';
import type { InstagramInterface } from '@/libs/instagram-bot';
import type { PixivBotApiQuery, RESPixivInterface, Work } from '@/libs/pixiv-bot';
import { ProxyFetchService } from '@/libs/proxy-fetch';

@Injectable()
export class PixivBotService {
  private readonly pixivApiUrl = 'https://www.pixiv.net/ajax/user/31359863/illusts/bookmarks';

  private readonly defaultLimit = 48;

  private cookie = '';

  constructor(
    private readonly proxyFetchService: ProxyFetchService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(PixivBotService.name);
  }

  private initCookie() {
    if (this.cookie === '') {
      try {
        this.cookie = readFileSync(pixivCookieFilePath, 'utf-8').trim();
      } catch {
        this.logger.error(new Error('pixiv cookie not found'));
      }
    }
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

  async fetchUndo(lastId?: string): Promise<InstagramInterface[]> {
    this.initCookie();
    const undoes: InstagramInterface[] = [];
    let offset = 0;

    let signal = true;
    do {
      const favorites = await this.fetch(offset);
      if (favorites.error) {
        this.logger.error(new Error(favorites.message));
        return [];
      }
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

  private parseQueryUrl({
    offset = 0,
    limit = this.defaultLimit,
    tag = '',
    rest = 'show',
    lang = 'zh',
    version = 'cfd4703d0f91cef84b888ca53a71f7f0181568cb',
  }: Partial<PixivBotApiQuery>) {
    const url = new URLSearchParams({
      tag,
      offset: String(offset),
      limit: String(limit),
      rest,
      lang,
      version,
    });
    return `${this.pixivApiUrl}?${url.toString()}`;
  }

  private async fetch(offset?: number) {
    const data = await this.proxyFetchService.proxyFetch(this.parseQueryUrl({ offset }), {
      headers: {
        cookie: this.cookie,
        'user-agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36`,
      },
    });
    // set-cookie: PHPSESSID
    const cookie = data.headers.get('set-cookie');
    if (cookie?.includes('PHPSESSID')) {
      const sessionId = cookie?.substring(cookie.indexOf('PHPSESSID='));
      const cookieStr = sessionId.split(';')[0];
      this.cookie = cookieStr;
      writeFileSync(pixivCookieFilePath, cookieStr);
    }
    const json = await data.json();
    return json as RESPixivInterface;
  }
}
