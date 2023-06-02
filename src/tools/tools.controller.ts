import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { ExcludeResponseInterceptor } from '@/common/decorator/exclude-response-interceptor.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import { Controller, Query, Sse } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { exec, spawn } from 'node:child_process';
import { basename } from 'node:path';
import { promisify } from 'node:util';
import { concat, from, fromEvent, map, merge, takeUntil } from 'rxjs';
import { ToolsService } from './tools.service';

@Controller('tools')
@ApiTags('tools')
@AdminAuthGuard()
export class ToolsController {
  constructor(private readonly toolsService: ToolsService, private readonly logger: LoggerService) {
    this.logger.setContext(ToolsController.name);
  }

  @Sse('video-downloader')
  @ApiExcludeEndpoint()
  @ExcludeResponseInterceptor()
  download(@Query('videoUrl') videoUrl: string) {
    const { downloadCommand, getFilenameCommand } = this.toolsService.yt_dlp(videoUrl);
    const download = spawn(downloadCommand, {
      shell: true,
    });
    const data$ = fromEvent(download.stdout, 'data', (event: Buffer) => {
      return {
        data: event.toString('utf8'),
      };
    });
    const close$ = fromEvent(download, 'close');
    const error$ = fromEvent(download.stderr, 'data', (event: Buffer) => {
      return {
        data: event.toString('utf8'),
      };
    });

    const asyncExec = promisify(exec);
    const downloadUrl$ = from(asyncExec(getFilenameCommand)).pipe(
      map((value) => {
        const filename = basename(value.stdout.trim());
        const downloadUrl = `https://api.powerfulyang.com/yt-dlp/${filename}`;
        return {
          type: 'done',
          data: { downloadUrl },
        };
      }),
    );

    return concat(merge(data$, error$).pipe(takeUntil(close$)), downloadUrl$);
  }
}
