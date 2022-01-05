import { Injectable } from '@nestjs/common';
import type { SavedFeedResponseMedia } from 'instagram-private-api';
import { IgApiClient } from 'instagram-private-api';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import type { InstagramInterface } from 'api/instagram-bot/instagram.interface';
import { ProxyFetchService } from 'api/proxy-fetch';
import { instagramCookieFilePath } from '@/constants/cookie-path';

@Injectable()
export class InstagramBotService {
  private readonly bot = new IgApiClient();

  private readonly cookiePath = instagramCookieFilePath;

  constructor(private proxyFetchService: ProxyFetchService) {
    const username = process.env.IG_USERNAME;
    if (username) {
      this.bot.state.generateDevice(username);
      const agent = this.proxyFetchService.getAgent();
      if (agent) {
        this.bot.request.defaults.agent = agent;
      }

      this.bot.request.end$.subscribe(async () => {
        const serialized = await this.bot.state.serialize();
        delete serialized.constants;
        writeFileSync(this.cookiePath, JSON.stringify(serialized));
      });
    }
  }

  private async checkLogin() {
    let shouldLogin = true;
    if (existsSync(this.cookiePath)) {
      try {
        const serialized = readFileSync(this.cookiePath);
        await this.bot.state.deserialize(serialized.toString());
        await this.bot.user.info(this.bot.state.cookieUserId);
        shouldLogin = false;
      } catch (e) {
        shouldLogin = true;
      }
    }
    if (shouldLogin) {
      await this.bot.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    }
  }

  async fetchUndo(lastId?: string): Promise<InstagramInterface[]> {
    await this.checkLogin();
    const savedFeed = this.bot.feed.saved();
    const saved: InstagramInterface[] = [];
    let signal = true;
    do {
      const pageSaved = await savedFeed.items();
      for (let i = 0; i < pageSaved.length; i++) {
        if (pageSaved[i].code === lastId) {
          signal = false;
          break;
        }
        saved.push(InstagramBotService.getDetailFromSavedMedia(pageSaved[i]));
      }
    } while (savedFeed.isMoreAvailable() && signal);
    return saved;
  }

  private static getTags(text?: string) {
    const tagsText = text?.replace(/[\n\r]/, '').match(/#[^#]*/gi);
    return (tagsText || []).map((x) => x.trim().replace(/^#/, ''));
  }

  private static getDetailFromSavedMedia(savedItem: SavedFeedResponseMedia): InstagramInterface {
    return {
      id: savedItem.code,
      tags: InstagramBotService.getTags(savedItem.caption?.text),
      imgList: savedItem.carousel_media?.map((x) => x.image_versions2.candidates[0].url) || [
        savedItem.image_versions2!.candidates[0].url,
      ],
      originUrl: `https://www.instagram.com/p/${savedItem.code}`,
    };
  }
}
