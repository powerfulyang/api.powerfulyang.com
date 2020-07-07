import { Module, HttpModule } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { TelegramBotModule } from 'api/telegram-bot';

@Module({
    imports: [HttpModule, TelegramBotModule],
    providers: [GithubService],
    controllers: [GithubController],
})
export class GithubModule {}
