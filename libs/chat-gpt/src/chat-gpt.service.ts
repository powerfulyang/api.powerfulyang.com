import { Injectable } from '@nestjs/common';
import { ProxyFetchService } from 'api/proxy-fetch';
import { LoggerService } from '@/common/logger/logger.service';

/**
 * Service for chat.openai.com
 * @see https://beta.openai.com/docs/api-reference/introduction
 */
@Injectable()
export class ChatGptService {
  constructor(
    private readonly proxyFetchService: ProxyFetchService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(ChatGptService.name);
  }

  refreshAccessToken() {
    this.logger.debug('refreshAccessToken');
    return this.proxyFetchService.proxyFetchJson('https://chat.openai.com/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.OPENAI_API_KEY,
      }),
    });
  }
}
