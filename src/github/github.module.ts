import { Module, HttpModule } from '@nestjs/common';
import { TelegramBotModule } from 'api/telegram-bot';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';

@Module({
    imports: [HttpModule, TelegramBotModule],
    providers: [GithubService],
    controllers: [GithubController],
})
export class GithubModule {}
