import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import type { RequestInfo, RequestInit } from 'node-fetch';
import fetch from 'node-fetch';
import { ProxyFetchService } from 'api/proxy-fetch';
import { CacheService } from '@/common/cache/cache.service';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';
import type { BingAIPayload } from '@/payload/BingAIPayload';
import type { ChatGPTPayload } from '@/payload/ChatGPTPayload';

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

  private BingAIClient;

  constructor(
    private readonly logger: LoggerService,
    private readonly proxyFetchService: ProxyFetchService,
    private readonly cacheService: CacheService,
  ) {
    this.logger.setContext(ChatGptService.name);
  }

  async getApiInstance(type: 'chat-gpt' | 'bing-ai' | 'gpt-3') {
    const chat_gpt_access_token = await this.cacheService.get(REDIS_KEYS.CHAT_GPT_ACCESS_TOKEN);
    const bing_ai_cookies = await this.cacheService.get(REDIS_KEYS.BING_AI_COOKIES);
    if (this.chatGPTApi && type === 'chat-gpt') {
      this.chatGPTApi = new this.ChatGPTBrowserClient({
        reverseProxyUrl: 'https://chatgpt.duti.tech/api/conversation',
        accessToken: chat_gpt_access_token,
        debug: false,
      });
      return this.chatGPTApi;
    }
    if (this.bingAIApi && type === 'bing-ai') {
      this.bingAIApi = new this.BingAIClient({
        cookies: bing_ai_cookies,
        debug: false,
      });
      return this.bingAIApi;
    }
    if (this.gpt3Api && type === 'gpt-3') {
      return this.gpt3Api;
    }
    return import('@waylaidwanderer/chatgpt-api').then(
      ({ ChatGPTClient, BingAIClient, ChatGPTBrowserClient }) => {
        this.gpt3Api = new ChatGPTClient(process.env.OPENAI_API_KEY);
        this.BingAIClient = BingAIClient;
        this.bingAIApi = new this.BingAIClient({
          cookies: bing_ai_cookies,
        });
        this.ChatGPTBrowserClient = ChatGPTBrowserClient;
        this.chatGPTApi = new this.ChatGPTBrowserClient({
          reverseProxyUrl: 'https://chatgpt.duti.tech/api/conversation',
          accessToken: chat_gpt_access_token,
        });
        // @ts-ignore rewrite fetch
        globalThis.fetch = (input: RequestInfo, init: RequestInit = {}) => {
          // eslint-disable-next-line no-param-reassign
          init.agent = this.proxyFetchService.getAgent();
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
  ): Promise<ChatGPTPayload> {
    let response;
    try {
      const instance = await this.getApiInstance('chat-gpt');
      response = await instance.sendMessage(msg, opt);
    } catch (e) {
      const instance = await this.getApiInstance('gpt-3');
      response = await instance.sendMessage(msg, opt);
    }
    const { response: message, conversationId, messageId } = response;
    return {
      parentMessageId: messageId,
      message,
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
  ): Promise<BingAIPayload> {
    const instance = await this.getApiInstance('bing-ai');
    const response = await instance.sendMessage(msg, opt);
    const {
      response: message,
      conversationSignature,
      conversationId,
      clientId,
      invocationId,
    } = response;
    this.logger.debug(`sendMessageWithBingAI response: ${JSON.stringify(response, null, 2)}`);
    if (response?.details?.contentOrigin === 'TurnLimiter') {
      return {
        message: '达到 BingAI 的对话上限，接下来将开始新的对话，请重新输入',
      };
    }
    return {
      message,
      conversationSignature,
      conversationId,
      clientId,
      invocationId,
    };
  }
}
