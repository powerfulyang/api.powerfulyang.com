import { describe, expect, it } from '@jest/globals';
import fetch from 'node-fetch';

describe('ChatGptService', () => {
  it('FlareSolver test', async () => {
    const res = await fetch('http://dev.powerfulyang.com:8191/v1', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        cmd: 'request.get',
        url: 'https://ipinfo.io/ip',
        // FlareSolver v3 doesn't support proxy now
        proxy: 'socks5://172.18.0.1:1080',
      }),
    });
    const json = await res.json();
    expect(json).toBeDefined();
  });
});
