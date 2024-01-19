import { LoggerService } from '@/common/logger/logger.service';
import { ASSET_PATH, EMT_ASSET_PATH } from '@/constants/asset_constants';
import { FeedService } from '@/feed/feed.service';
import { ProxyFetchService } from '@/libs/proxy-fetch';
import { MqService } from '@/service/mq/mq.service';
import { User } from '@/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { lastItem } from '@powerfulyang/utils';
import { ensureDirSync } from 'fs-extra';
import TelegramBot from 'node-telegram-bot-api';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

@Injectable()
export class TelegramBotService {
  private readonly bot?: TelegramBot;

  private readonly token = process.env.TELEGRAM_BOT_TOKEN;

  constructor(
    private readonly proxyFetchService: ProxyFetchService,
    private readonly logger: LoggerService,
    private readonly mqService: MqService,
    private readonly feedService: FeedService,
  ) {
    this.logger.setContext(TelegramBotService.name);
    if (this.token) {
      this.bot = new TelegramBot(this.token, {
        // @ts-ignore
        request: {
          agent: this.proxyFetchService.agent,
        },
        polling: true,
      });
      this.bot.on('channel_post', (msg) => {
        const sender = msg.sender_chat;
        this.logger.debug(`handle msg: ${JSON.stringify(msg, null, 2)}`);
        if (sender?.type === 'channel' && sender.username === 'emt_channel') {
          this.mqService.notifyHandleFeed(msg);
        }
      });
    }
  }

  async writeMsgToFeed(msg: TelegramBot.Message) {
    const photos = msg.photo;
    const { document, video } = msg;

    let content = msg.text || msg.caption || 'From Telegram';

    const assets: any[] = [];
    if (photos) {
      // 只取最大的一张
      const last = lastItem(photos);
      if (last) {
        const path = join(EMT_ASSET_PATH, last.file_id);
        ensureDirSync(path);
        const file_path = await this.bot?.downloadFile(last.file_id, path);
        if (file_path) {
          const buffer = readFileSync(file_path);
          assets.push({
            data: buffer,
          });
        }
      }
    }
    if (document && document.mime_type?.startsWith('image')) {
      // 只取最大的一张
      const path = join(EMT_ASSET_PATH, document.file_id);
      ensureDirSync(path);
      const file_path = await this.bot?.downloadFile(document.file_id, path);
      if (file_path) {
        const buffer = readFileSync(file_path);
        assets.push({
          data: buffer,
        });
      }
    }
    if (document && document.mime_type?.startsWith('video')) {
      const path = join(EMT_ASSET_PATH, document.file_id);
      ensureDirSync(path);
      const file_path = await this.bot?.downloadFile(document.file_id, path);
      const relativePath = file_path?.replace(ASSET_PATH, '');
      const videoUrl = `https://api.powerfulyang.com/${relativePath}`;
      // add video url to content 简单处理下
      content += `\n:::video\n${videoUrl}\n:::`;
    }
    if (video) {
      const path = join(EMT_ASSET_PATH, video.file_id);
      ensureDirSync(path);
      const file_path = await this.bot?.downloadFile(video.file_id, path);
      const relativePath = file_path?.replace(ASSET_PATH, '');
      const videoUrl = `https://api.powerfulyang.com/${relativePath}`;
      // add video url to content 简单处理下
      content += `\n:::video\n${videoUrl}\n:::`;
    }
    const admin = new User();
    admin.id = 1;
    await this.feedService.postFeed({
      public: true,
      content,
      createBy: admin,
      assets,
    });
    this.logger.info(`handle msg: ${msg.message_id}`);
  }
}
