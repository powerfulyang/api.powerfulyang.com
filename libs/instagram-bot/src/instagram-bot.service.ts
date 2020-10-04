import { Injectable } from '@nestjs/common';
import {
    IgApiClient,
    SavedFeedResponseMedia,
} from 'instagram-private-api';
import mkdirp from 'mkdirp';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { InstagramInterface } from 'api/instagram-bot/instagram.interface';
import { getTags } from '../../../src/utils/util';
import { RssInterface } from '../../../src/core/base/interface/rss.interface';

const Agent = require('socks5-https-client/lib/Agent');

@Injectable()
export class InstagramBotService implements RssInterface {
    private readonly bot: IgApiClient;

    constructor() {
        this.bot = new IgApiClient();
        this.bot.state.generateDevice(
            <string>process.env.IG_USERNAME,
        );
        const {
            BOT_SOCKS5_PROXY_HOST,
            BOT_SOCKS5_PROXY_PORT,
        } = process.env;
        this.bot.request.defaults.agentClass = Agent;
        this.bot.request.defaults.agentOptions = {
            socksHost: BOT_SOCKS5_PROXY_HOST,
            socksPort: Number(BOT_SOCKS5_PROXY_PORT),
        } as any;
    }

    async loginIn() {
        let cookiePath = join(process.cwd(), '.instagram-bot');
        await mkdirp(cookiePath);
        cookiePath = join(cookiePath, 'cookies');
        this.bot.request.end$.subscribe(async () => {
            const serialized = await this.bot.state.serialize();
            delete serialized.constants;
            writeFileSync(cookiePath, JSON.stringify(serialized));
        });
        let shouldLogin = true;
        if (existsSync(cookiePath)) {
            try {
                const serialized = readFileSync(cookiePath);
                await this.bot.state.deserialize(
                    serialized.toString(),
                );
                await this.bot.user.info(this.bot.state.cookieUserId);
                shouldLogin = false;
            } catch (e) {
                shouldLogin = true;
            }
        }
        if (shouldLogin) {
            await this.bot.account.login(
                <string>process.env.IG_USERNAME,
                <string>process.env.IG_PASSWORD,
            );
        }
    }

    async fetchUndo(lastId?: string): Promise<InstagramInterface[]> {
        const savedFeed = this.bot.feed.saved();
        const saved: any[] = [];
        let signal = true;
        do {
            const pageSaved = await savedFeed.items();
            for (let i = 0; i < pageSaved.length; i++) {
                if (pageSaved[i].id === lastId) {
                    signal = false;
                    break;
                }
                saved.push(
                    InstagramBotService.getDetailFromSavedMedia(
                        pageSaved[i],
                    ),
                );
            }
        } while (savedFeed.isMoreAvailable() && signal);
        return saved;
    }

    private static getDetailFromSavedMedia(
        savedItem: SavedFeedResponseMedia,
    ) {
        return {
            id: savedItem.id,
            tags: getTags(savedItem.caption?.text),
            imgList: savedItem.carousel_media?.map(
                (x) => x.image_versions2.candidates[0].url,
            ) || [savedItem.image_versions2?.candidates[0].url],
        };
    }
}
