import { Injectable } from '@nestjs/common';
import fetch, { RequestInit } from 'node-fetch';
import { parseString } from 'xml2js';

const Agent = require('socks5-https-client/lib/Agent');

@Injectable()
export class CoreService {
    private readonly agent = new Agent({
        socksHost: process.env.BOT_SOCKS5_PROXY_HOST,
        socksPort: process.env.BOT_SOCKS5_PROXY_PORT,
    });

    proxyFetch(url: string, draft: RequestInit = {}) {
        draft.agent = this.agent;
        return fetch(url, draft);
    }

    async proxyFetchJson<T>(
        url: string,
        draft: RequestInit = {},
    ): Promise<T> {
        const res = await this.proxyFetch(url, draft);
        return res.json();
    }

    async proxyFetchJsonFromRss<T>(
        rssUrl: string,
        draft: RequestInit = {},
    ): Promise<T> {
        const res = await this.proxyFetch(rssUrl, draft);
        const content = await res.text();
        return new Promise((resolve, reject) => {
            parseString(content, (err, json) => {
                if (err) {
                    reject(err);
                }
                resolve(json);
            });
        });
    }
}
