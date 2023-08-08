import process from 'node:process';
import { Inject, Injectable, Optional } from '@nestjs/common';
import type { RequestInit } from 'node-fetch';
import _fetch from 'node-fetch';

@Injectable()
export class ClickUpService {
  constructor(@Optional() @Inject('CLICK_UP_API_KEY') private readonly apiKey: string) {
    if (!this.apiKey) {
      this.apiKey = process.env.CLICK_UP_API_KEY;
    }
  }

  private fetch(url: string, options?: RequestInit) {
    return _fetch(url, {
      headers: {
        authorization: this.apiKey,
        ...options?.headers,
      },
      ...options,
    });
  }

  async getLists() {
    const { teams } = await this.getTeams();
    const defaultTeam = teams[0] as { id: number };
    const res = await this.fetch(`https://api.clickup.com/api/v2/list/${defaultTeam.id}`);
    return res.json();
  }

  async getTeams() {
    const res = await this.fetch('https://api.clickup.com/api/v2/team');
    return res.json();
  }
}
