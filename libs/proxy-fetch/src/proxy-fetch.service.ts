import { Injectable } from '@nestjs/common';
import type { RequestInit } from 'node-fetch';
import fetch from 'node-fetch';
import { SocksProxyAgent } from 'socks-proxy-agent';

@Injectable()
export class ProxyFetchService {
  private readonly opt: RequestInit = {
    timeout: 30000,
  };

  constructor() {
    /**
     * 如果没有代理设置 则不使用代理
     */
    if (process.env.BOT_SOCKS5_PROXY_HOST && process.env.BOT_SOCKS5_PROXY_PORT) {
      this.opt.agent = new SocksProxyAgent({
        hostname: process.env.BOT_SOCKS5_PROXY_HOST,
        port: process.env.BOT_SOCKS5_PROXY_PORT,
        type: 5,
      });
    }
  }

  getAgent() {
    return this.opt.agent as SocksProxyAgent;
  }

  proxyFetch(url: string, draft: RequestInit = this.opt) {
    return fetch(url, {
      ...this.opt,
      ...draft,
    });
  }

  async proxyFetchJson<T = any>(url: string, draft: RequestInit = this.opt): Promise<T> {
    const res = await this.proxyFetch(url, draft);
    return (await res.json()) as Promise<T>;
  }
}
