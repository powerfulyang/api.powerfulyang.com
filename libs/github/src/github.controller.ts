import { LoggerService } from '@/common/logger/logger.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('github')
@ApiTags('github')
export class GithubController {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(GithubController.name);
  }
}
