import { Controller, Post } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import { FcmService } from './fcm.service';

@Controller('fcm')
export class FcmController {
  constructor(
    private readonly fcmService: FcmService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(FcmController.name);
  }

  @Post('subscribe')
  subscribe() {
    return this.fcmService.subscribe();
  }
}
