import { Module } from '@nestjs/common';
import { TelegramBotModule } from 'api/telegram-bot';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';

@Module({
    imports: [TelegramBotModule],
    providers: [GithubService],
    controllers: [GithubController],
})
export class GithubModule {}
