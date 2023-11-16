import { PublicAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { ExcludeResponseInterceptor } from '@/common/decorator/exclude-response-interceptor.decorator';
import { AuthUser } from '@/common/decorator/user-from-auth.decorator';
import { LoggerService } from '@/common/logger/logger.service';
import { OCRDto } from '@/tools/dto/OCR.dto';
import { User } from '@/user/entities/user.entity';
import { Body, Controller, Header, Post, Query, Sse } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { of } from 'rxjs';
import { ToolsService } from './tools.service';

@Controller('tools')
@ApiTags('tools')
export class ToolsController {
  constructor(
    private readonly toolsService: ToolsService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(ToolsController.name);
  }

  @Sse('video-downloader')
  @ApiExcludeEndpoint()
  @ExcludeResponseInterceptor()
  @PublicAuthGuard()
  @Header('Content-Type', 'text/event-stream; charset=utf-8')
  download(@Query('videoUrl') videoUrl: string, @AuthUser() user: User) {
    if (!videoUrl) {
      return of({
        type: 'error',
        data: 'videoUrl is required',
      });
    }
    if (user.email !== User.IntendedUsers.AdminUser) {
      return of({
        type: 'error',
        data: 'Permission denied, please contact admin, email:i@powerfulyang.com',
      });
    }
    return this.toolsService.download(videoUrl);
  }

  @Post('ocr')
  ocr(@Body() { images }: OCRDto) {
    return this.toolsService.ocr(images[0].data);
  }
}
