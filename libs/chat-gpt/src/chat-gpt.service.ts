import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import type { RequestInfo, RequestInit } from 'node-fetch';
import fetch from 'node-fetch';
import { ProxyFetchService } from 'api/proxy-fetch';

/**
 * Service for chat.openai.com
 * @see https://beta.openai.com/docs/api-reference/introduction
 */
@Injectable()
export class ChatGptService {
  private api;

  constructor(
    private readonly logger: LoggerService,
    private readonly proxyFetchService: ProxyFetchService,
  ) {
    this.logger.setContext(ChatGptService.name);
  }

  async getApiInstance() {
    if (this.api) {
      return this.api;
    }
    return import('@waylaidwanderer/chatgpt-api').then(({ default: ChatGPTClient }) => {
      this.api = new ChatGPTClient(process.env.OPENAI_API_KEY, {
        modelOptions: {
          model: 'text-davinci-003',
        },
        debug: false,
      });
      // @ts-ignore rewrite fetch
      globalThis.fetch = (input: RequestInfo, init: RequestInit = {}) => {
        if (input === 'https://api.openai.com/v1/completions') {
          // eslint-disable-next-line no-param-reassign
          init.agent = this.proxyFetchService.getAgent();
        }
        return fetch(input, init);
      };
      return this.api;
    });
  }

  async sendMessage(
    msg: string,
    opt: {
      parentMessageId?: string;
      conversationId?: string;
    } = {},
  ) {
    const instance = await this.getApiInstance();
    const response = await instance.sendMessage(msg, opt);
    const { response: content, conversationId, messageId } = response;
    return {
      messageId,
      content,
      conversationId,
    };
  }
}
