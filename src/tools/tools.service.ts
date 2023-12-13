import { LoggerService } from '@/common/logger/logger.service';
import { COOKIE_PATH } from '@/constants/cookie-path';
import { ProxyFetchService } from '@/libs/proxy-fetch';
import { OcrService } from '@/tools/ocr/ocrService';
import type { User } from '@/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { sha1 } from '@powerfulyang/node-utils';
import { ensureFileSync } from 'fs-extra';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import process from 'node:process';
import { concatWith, fromEvent, merge, of, switchMap, takeUntil } from 'rxjs';
import sharp from 'sharp';
import type { ImageLike } from 'tesseract.js';

@Injectable()
export class ToolsService {
  private readonly proxyUri: string = '';

  constructor(
    private readonly logger: LoggerService,
    private readonly proxyFetchService: ProxyFetchService,
    private readonly ocrService: OcrService,
  ) {
    this.logger.setContext(ToolsService.name);
    this.proxyUri = this.proxyFetchService.proxyUri;
  }

  generateVideoDownloadCommand(url: string, user: User) {
    const hash = sha1(url);
    const downloadPath = join(process.cwd(), `assets/yt-dlp/${hash}.%(ext)s`);
    const getFilenameCommand = `yt-dlp ${url} --proxy '${this.proxyUri}' --output '${downloadPath}' --get-filename`;
    const cookiesPath = join(COOKIE_PATH, 'yt-dlp', user.id.toString());
    let cookiesOption = '';
    if (existsSync(cookiesPath)) {
      cookiesOption = `--cookies ${cookiesPath}`;
    }
    const downloadCommand = `yt-dlp ${url} ${cookiesOption} --proxy '${this.proxyUri}' --output '${downloadPath}'`;
    return {
      getFilenameCommand,
      downloadCommand,
    };
  }

  async ocr(imageBuffer: ImageLike) {
    const result = await this.ocrService.recognize(imageBuffer);
    return result.text;
  }

  download(videoUrl: string, user: User) {
    const { downloadCommand, getFilenameCommand } = this.generateVideoDownloadCommand(
      videoUrl,
      user,
    );
    const download = spawn(downloadCommand, {
      shell: true,
    });
    const data$ = fromEvent(download.stdout, 'data', (event: Buffer) => {
      return {
        data: event.toString('utf8'),
      };
    });
    const error$ = fromEvent(download.stderr, 'data', (event: Buffer) => {
      return {
        data: event.toString('utf8'),
      };
    });
    const close$ = fromEvent(download, 'close');

    const download$ = merge(data$, error$).pipe(takeUntil(close$));

    // const filename = basename(event.toString('utf8'));
    //       const downloadUrl = `https://api.powerfulyang.com/yt-dlp/${filename}`;
    //       return {
    //         type: 'done',
    //         data: downloadUrl,
    //       };

    return download$.pipe(
      concatWith(
        of(null).pipe(
          switchMap(() => {
            const getFilename = spawn(getFilenameCommand, {
              shell: true,
            });
            const _data$ = fromEvent(getFilename.stdout, 'data', (event: Buffer) => {
              const filename = basename(event.toString('utf8'));
              const downloadUrl = `https://api.powerfulyang.com/yt-dlp/${filename}`;
              return {
                type: 'done',
                data: downloadUrl,
              };
            });
            const _close$ = fromEvent(getFilename, 'close');
            const _error$ = fromEvent(getFilename.stderr, 'data', (event: Buffer) => {
              return {
                type: 'error',
                data: event.toString('utf8'),
              };
            });
            return merge(_data$, _error$).pipe(takeUntil(_close$));
          }),
        ),
      ),
    );
  }

  saveCookies(cookies: string, user: User) {
    const path = join(COOKIE_PATH, 'yt-dlp', user.id.toString());
    ensureFileSync(path);
    writeFileSync(path, cookies);
  }

  readCookies(user: User) {
    const path = join(COOKIE_PATH, 'yt-dlp', user.id.toString());
    try {
      return readFileSync(path, 'utf8');
    } catch {
      return '';
    }
  }

  compress(data: Buffer) {
    const sharpInstance = sharp(data);
    return sharpInstance.rotate().webp().resize(300, 300).toBuffer();
  }
}
