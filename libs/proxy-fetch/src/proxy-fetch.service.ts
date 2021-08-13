import { Injectable } from '@nestjs/common';
import { parseString } from 'xml2js';
import fetch, { RequestInit } from 'node-fetch';
import { SocksProxyAgent } from 'socks-proxy-agent';

@Injectable()
export class ProxyFetchService {
  readonly agent;

  constructor() {
    if (process.env.BOT_SOCKS5_PROXY_HOST || process.env.BOT_SOCKS5_PROXY_PORT) {
      this.agent = new SocksProxyAgent({
        host: process.env.BOT_SOCKS5_PROXY_HOST,
        port: process.env.BOT_SOCKS5_PROXY_PORT,
      });
    }
  }

  proxyFetch(url: string, draft: RequestInit = {}) {
    draft.agent = this.agent;
    return fetch(url, draft);
  }

  async proxyFetchJson<T>(url: string, draft: RequestInit = {}): Promise<T> {
    const res = await this.proxyFetch(url, draft);
    return res.json();
  }

  async proxyFetchJsonFromRss<T>(rssUrl: string, draft: RequestInit = {}): Promise<T> {
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
