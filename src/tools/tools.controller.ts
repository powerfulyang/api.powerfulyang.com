import { AdminAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ToolsService } from './tools.service';

@Controller('tools')
@ApiTags('tools')
@AdminAuthGuard()
export class ToolsController {
  constructor(private readonly toolsService: ToolsService, private readonly logger: LoggerService) {
    this.logger.setContext(ToolsController.name);
  }

  @Get('download')
  async download(@Query('url') url: string) {
    const filename = await this.toolsService.download(url);
    return `https://api.powerfulyang.com/yt-dlp/${filename}`;
  }
}
