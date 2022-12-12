import { Injectable } from '@nestjs/common';
import { ProxyFetchService } from 'api/proxy-fetch';
import { LoggerService } from '@/common/logger/logger.service';
import fs from 'node:fs';
import { chatGptSessionTokenFilePath } from '@/constants/cookie-path';
import { CacheService } from '@/common/cache/cache.service';
import { generateUuid } from '@/utils/uuid';
import type { ChatGPTResponse } from '@app/chat-gpt/type';

/**
 * Service for chat.openai.com
 * @see https://beta.openai.com/docs/api-reference/introduction
 */
@Injectable()
export class ChatGptService {
  private readonly useAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36';

  static Key = 'chat-gpt:access-token';

  constructor(
    private readonly proxyFetchService: ProxyFetchService,
    private readonly logger: LoggerService,
    private readonly cacheService: CacheService,
  ) {
    this.logger.setContext(ChatGptService.name);
  }

  getPersistenceCookie() {
    // return file cache
    return fs.readFileSync(chatGptSessionTokenFilePath, 'utf-8').trim();
  }

  async getAccessToken() {
    const cache = await this.cacheService.get(ChatGptService.Key);
    if (cache) {
      return cache;
    }
    const persistenceCookie = this.getPersistenceCookie();
    const res = await this.proxyFetchService.proxyFetch(
      'https://chat.openai.com/api/auth/session',
      {
        headers: {
          Cookie: persistenceCookie,
          'User-Agent': this.useAgent,
        },
      },
    );
    const json = (await res.json()) as {
      accessToken: string;
      error: string;
    };
    const { accessToken, error } = json;
    if (!accessToken) {
      throw new Error('accessToken is empty');
    }
    if (error) {
      throw new Error(error);
    }
    this.cacheService.set(ChatGptService.Key, accessToken, 'EX', 60 * 60 * 24 * 30);
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      const cookie = setCookie.split(';')[0];
      const newCookie = persistenceCookie
        .split('; ')
        .map((item) => {
          if (item.includes('session-token')) {
            return cookie;
          }
          return item;
        })
        .join('; ');
      fs.writeFileSync(chatGptSessionTokenFilePath, newCookie, 'utf-8');
    }
    return accessToken;
  }

  private async send(
    message: string,
    opt: {
      parentMessageId?: string;
      conversationId?: string;
    } = {},
  ): Promise<ChatGPTResponse> {
    const { parentMessageId = generateUuid(), conversationId } = opt;
    if (message.length > 4000) {
      throw new Error('message length is too long');
    }
    const body = {
      action: 'next',
      messages: [
        {
          id: generateUuid(),
          role: 'user',
          content: {
            content_type: 'text',
            parts: [message],
          },
        },
      ],
      model: 'text-davinci-002-render',
      parent_message_id: parentMessageId,
      conversationId,
    };
    const accessToken = await this.getAccessToken();
    const persistenceCookie = this.getPersistenceCookie();
    const res = await this.proxyFetchService.proxyFetch(
      'https://chat.openai.com/backend-api/conversation',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': this.useAgent,
          'Content-Type': 'application/json',
          Cookie: persistenceCookie,
        },
        body: JSON.stringify(body),
        timeout: 1000 * 60 * 10,
      },
    );
    const buffer = await res.buffer();
    const text = buffer.toString();
    const lines = text
      .split('\n')
      .filter((line) => {
        return line.trim();
      })
      .map((line) => {
        return line.replace('data: ', '');
      });
    const responseLine = lines[lines.length - 2];
    this.logger.debug(`responseLine: ${responseLine}`);
    return JSON.parse(responseLine);
  }

  async sendMessage(
    msg: string,
    opt: {
      parentMessageId?: string;
      conversationId?: string;
    } = {},
  ) {
    const res = await this.send(msg, opt);
    const { message, conversation_id, error } = res;
    if (error) {
      throw new Error(error);
    }
    const messageId = message.id;
    const content = message.content.parts[0];
    return {
      messageId,
      content,
      conversationId: conversation_id,
    };
  }
}
