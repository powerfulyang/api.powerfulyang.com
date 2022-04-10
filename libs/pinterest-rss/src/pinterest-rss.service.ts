import { Injectable } from '@nestjs/common';
import { PinterestInterface, RSSPinterestInterface } from 'api/pinterest-rss/pinterest.interface';
import { ProxyFetchService } from 'api/proxy-fetch';

@Injectable()
export class PinterestRssService {
  constructor(private proxyFetchService: ProxyFetchService) {}

  private readonly myRssUrl = 'https://www.pinterest.com/powerfulyang/feed.rss';

  private async fetchAll(): Promise<PinterestInterface[]> {
    const json = await this.proxyFetchService.proxyFetchJsonFromRss<RSSPinterestInterface>(
      this.myRssUrl,
    );
    return PinterestRssService.transform(json);
  }

  async fetchUndo(lastId?: string): Promise<PinterestInterface[]> {
    const allPosts = await this.fetchAll();
    const undoPosts: PinterestInterface[] = [];
    for (let i = 0; i < allPosts.length; i++) {
      if (allPosts[i].id === lastId) {
        break;
      }
      undoPosts.push(allPosts[i]);
    }
    return undoPosts;
  }

  private static transform(originJson: RSSPinterestInterface): PinterestInterface[] {
    const urls = originJson.rss.channel[0].item.map((x: any) => {
      // ?<=  ?  ?= to get ? search
      return {
        url: x.description[0].match(/(?<=src=").+?(?=")/)[0],
        id: x.guid[0].match(/(?<=pin\/).+?(?=\/)/)[0],
      };
    });
    return urls.map((x: any) => {
      return {
        imgList: [x.url.replace(/236x/, 'originals')],
        id: x.id,
        tags: [],
        originUrl: `https://www.pinterest.com/pin/${x.id}`,
      };
    });
  }
}
