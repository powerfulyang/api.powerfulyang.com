import { BadRequestException, Injectable } from '@nestjs/common';
import type {
  PinterestInterface,
  PinterestResInterface,
} from 'api/pinterest-bot/pinterest.interface';
import { ProxyFetchService } from 'api/proxy-fetch';

@Injectable()
export class PinterestBotService {
  constructor(private proxyFetchService: ProxyFetchService) {}

  async processRequestNext(lastId?: string, bookmark?: string) {
    const sourceUrl = '/powerfulyang/bot/';
    const requestUrl = 'https://www.pinterest.com/resource/BoardFeedResource/get/';
    const data = {
      options: {
        board_id: '836262293247136334',
        board_url: '/powerfulyang/bot/',
        currentFilter: -1,
        field_set_key: 'partner_react_grid_pin',
        filter_section_pins: true,
        sort: 'default',
        layout: 'default',
        page_size: 100, // Page size exceeds maximum value of 250
        redux_normalize_feed: true,
        no_fetch_context_on_resource: false,
      },
      context: {},
    };
    if (bookmark) {
      // @ts-ignore
      data.options.bookmarks = [bookmark];
    }
    const params = new URLSearchParams({
      source_url: sourceUrl,
      data: JSON.stringify(data),
      _: String(Date.now()),
    });

    let array: PinterestInterface[] = [];

    const res = await this.proxyFetchService.proxyFetchJson<PinterestResInterface>(
      `${requestUrl}?${params.toString()}`,
    );
    if (res.resource_response.code === 0) {
      for (const datum of res.resource_response.data) {
        if (datum.id === lastId) {
          return array;
        }
        const obj: PinterestInterface = {
          id: datum.id,
          imgList: [datum.images.orig.url],
          tags: [],
          originUrl: `https://www.pinterest.com/pin/${datum.id}`,
        };
        array.push(obj);
      }
      const nextBookmark = res.resource_response.bookmark;
      if (nextBookmark) {
        // 如果有还有下一页
        array = array.concat(await this.processRequestNext(lastId, nextBookmark));
      }
      return array;
    }
    throw new BadRequestException();
  }

  fetchUndo(lastId?: string): Promise<PinterestInterface[]> {
    return this.processRequestNext(lastId);
  }
}
