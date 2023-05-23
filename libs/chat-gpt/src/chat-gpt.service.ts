import { LoggerService } from '@/common/logger/logger.service';
import type { ChatGPTPayload } from '@/payload/ChatGPTPayload';
import { Injectable } from '@nestjs/common';
import { ProxyFetchService } from 'api/proxy-fetch';
import type { RequestInfo, RequestInit } from 'node-fetch';
import fetch from 'node-fetch';

/**
 * Service for chat.openai.com
 * @see https://beta.openai.com/docs/api-reference/introduction
 */
@Injectable()
export class ChatGptService {
  private chatGPTApi: any;

  private ChatGPTClient: any;

  constructor(
    private readonly logger: LoggerService,
    private readonly proxyFetchService: ProxyFetchService,
  ) {
    this.logger.setContext(ChatGptService.name);
  }

  async getApiInstance(type: 'chat-gpt' | 'bing-ai') {
    if (this.chatGPTApi && type === 'chat-gpt') {
      return this.chatGPTApi;
    }
    return import('@waylaidwanderer/chatgpt-api').then(({ ChatGPTClient }) => {
      this.ChatGPTClient = ChatGPTClient;
      this.chatGPTApi = new this.ChatGPTClient();
      // @ts-ignore rewrite fetch
      globalThis.fetch = (input: RequestInfo, init: RequestInit = {}) => {
        // eslint-disable-next-line no-param-reassign
        init.agent = this.proxyFetchService.agent;
        return fetch(input, init);
      };
      if (type === 'chat-gpt') {
        return this.chatGPTApi;
      }
      return this.chatGPTApi;
    });
  }

  async sendMessage(
    msg: string,
    opt: {
      parentMessageId?: string;
      conversationId?: string;
    } = {},
  ): Promise<ChatGPTPayload> {
    const instance = await this.getApiInstance('chat-gpt');
    const response = await instance.sendMessage(msg, opt);
    const { response: message, conversationId, messageId } = response;
    return {
      parentMessageId: messageId,
      message,
      conversationId,
    };
  }
}
