import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import type { RequestInfo, RequestInit } from 'node-fetch';
import fetch from 'node-fetch';
import { ProxyFetchService } from 'api/proxy-fetch';
import { CacheService } from '@/common/cache/cache.service';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';

/**
 * Service for chat.openai.com
 * @see https://beta.openai.com/docs/api-reference/introduction
 */
@Injectable()
export class ChatGptService {
  private chatGPTApi;

  private gpt3Api;

  private bingAIApi;

  private ChatGPTBrowserClient;

  constructor(
    private readonly logger: LoggerService,
    private readonly proxyFetchService: ProxyFetchService,
    private readonly cacheService: CacheService,
  ) {
    this.logger.setContext(ChatGptService.name);
  }

  async getApiInstance(type: 'chat-gpt' | 'bing-ai' | 'gpt-3') {
    const accessToken = await this.cacheService.get(REDIS_KEYS.CHAT_GPT_ACCESS_TOKEN);
    if (this.chatGPTApi && type === 'chat-gpt') {
      this.chatGPTApi = new this.ChatGPTBrowserClient({
        reverseProxyUrl: 'https://chatgpt.duti.tech/api/conversation',
        accessToken,
      });
      return this.chatGPTApi;
    }
    if (this.bingAIApi && type === 'bing-ai') {
      return this.bingAIApi;
    }
    if (this.gpt3Api && type === 'gpt-3') {
      return this.gpt3Api;
    }
    return import('@waylaidwanderer/chatgpt-api').then(
      ({ ChatGPTClient, BingAIClient, ChatGPTBrowserClient }) => {
        this.gpt3Api = new ChatGPTClient(process.env.OPENAI_API_KEY, {
          modelOptions: {
            model: 'text-davinci-003',
          },
          debug: false,
        });
        this.bingAIApi = new BingAIClient({
          cookies: process.env.BING_COOKIES,
          debug: false,
        });
        this.ChatGPTBrowserClient = ChatGPTBrowserClient;
        this.chatGPTApi = new this.ChatGPTBrowserClient({
          reverseProxyUrl: 'https://chatgpt.duti.tech/api/conversation',
          accessToken,
        });
        // @ts-ignore rewrite fetch
        globalThis.fetch = (input: RequestInfo, init: RequestInit = {}) => {
          if (input === 'https://api.openai.com/v1/completions') {
            // eslint-disable-next-line no-param-reassign
            init.agent = this.proxyFetchService.getAgent();
          }
          return fetch(input, init);
        };
        if (type === 'bing-ai') {
          return this.bingAIApi;
        }
        if (type === 'gpt-3') {
          return this.gpt3Api;
        }
        return this.chatGPTApi;
      },
    );
  }

  async sendMessage(
    msg: string,
    opt: {
      parentMessageId?: string;
      conversationId?: string;
    } = {},
  ) {
    let response;
    try {
      const instance = await this.getApiInstance('chat-gpt');
      response = await instance.sendMessage(msg, opt);
    } catch (e) {
      const instance = await this.getApiInstance('gpt-3');
      response = await instance.sendMessage(msg, opt);
    }
    const { response: content, conversationId, messageId } = response;
    return {
      messageId,
      content,
      conversationId,
    };
  }

  async sendMessageWithBingAI(
    msg: string,
    opt: {
      conversationSignature?: string;
      conversationId?: string;
      clientId?: string;
      invocationId?: string;
    } = {},
  ) {
    const instance = await this.getApiInstance('bing-ai');
    const response = await instance.sendMessage(msg, opt);
    const {
      response: content,
      conversationSignature,
      conversationId,
      clientId,
      invocationId,
    } = response;
    return {
      content,
      conversationSignature,
      conversationId,
      clientId,
      invocationId,
    };
  }
}
