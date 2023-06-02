import { Injectable } from '@nestjs/common';
import type { RequestInit } from 'node-fetch';
import fetch from 'node-fetch';
import process from 'node:process';
import { SocksProxyAgent } from 'socks-proxy-agent';

@Injectable()
export class ProxyFetchService {
  private readonly opt: RequestInit = {
    timeout: 30000,
  };

  public readonly proxyUri: string = '';

  constructor() {
    /**
     * 如果没有代理设置 则不使用代理
     */
    if (process.env.BOT_SOCKS5_PROXY_HOST && process.env.BOT_SOCKS5_PROXY_PORT) {
      this.proxyUri = `socks5://${process.env.BOT_SOCKS5_PROXY_HOST}:${process.env.BOT_SOCKS5_PROXY_PORT}`;
      this.opt.agent = new SocksProxyAgent(this.proxyUri);
    }
  }

  get agent() {
    return this.opt.agent as SocksProxyAgent;
  }

  proxyFetch(url: string, draft: RequestInit = this.opt) {
    return fetch(url, {
      ...this.opt,
      ...draft,
    });
  }

  async proxyFetchJson<T = any>(url: string, draft: RequestInit = this.opt): Promise<T> {
    const res = await this.proxyFetch(url, {
      ...this.opt,
      ...draft,
    });
    const json = await res.json();
    return json as T;
  }
}
