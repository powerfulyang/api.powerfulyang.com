import { Injectable } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger.mjs';
import { CoreService } from '@/core/core.service.mjs';

@Injectable()
export class PublicService {
  constructor(private readonly logger: AppLogger, private readonly coreService: CoreService) {
    this.logger.setContext(PublicService.name);
  }

  isCommonNode() {
    return this.coreService.isCommonNode();
  }
}
