import { LoggerService } from '@/common/logger/logger.service';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GithubService } from './github.service';

@Controller('github')
@ApiTags('github')
export class GithubController {
  constructor(
    private readonly logger: LoggerService,
    private readonly githubService: GithubService,
  ) {
    this.logger.setContext(GithubController.name);
  }

  @Get('user_info/:login')
  getUserInfo(@Param('login') login: string) {
    return this.githubService.userInfo(login);
  }
}
