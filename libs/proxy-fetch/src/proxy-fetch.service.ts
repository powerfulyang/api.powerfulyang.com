import { Injectable } from '@nestjs/common';
import { sha1 } from '@powerfulyang/node-utils';
import type { RequestInit } from 'node-fetch';
import fetch from 'node-fetch';
import { exec } from 'node:child_process';
import { basename, join } from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
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
    const res = await this.proxyFetch(url, draft);
    return (await res.json()) as Promise<T>;
  }

  async yt_dlp(url: string) {
    const hash = sha1(url);
    const asyncExec = promisify(exec);
    const downloadPath = join(process.cwd(), `assets/yt-dlp/${hash}.%(ext)s`);
    const executed = await asyncExec(
      `yt-dlp ${url} --proxy '${this.proxyUri}' --output '${downloadPath}' --get-filename`,
    );
    await asyncExec(`yt-dlp ${url} --proxy '${this.proxyUri}' --output '${downloadPath}'`);
    return basename(executed.stdout.trim());
  }
}
