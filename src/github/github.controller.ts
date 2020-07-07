import { Body, Controller, Headers, Logger, Post, UseGuards } from '@nestjs/common';
import { IHeader, Payload, Type } from './github.interfaces';
import { GithubService } from './github.service';
import { GitHubEventsGuard } from './github-event.guard';
import { GithubWebhookActions, GithubWebhookEvents } from './github.decorator';

@Controller('github')
export class GithubController {
    private readonly logger = new Logger(GithubController.name);
    constructor(private readonly githubService: GithubService) {}

    @UseGuards(GitHubEventsGuard)
    @GithubWebhookEvents(['issues', 'pull_request'])
    @GithubWebhookActions(['opened', 'closed'])
    @Post()
    async getWebhook(@Body() payload: Payload, @Headers() headers: IHeader) {
        const type: Type = headers['x-github-event'];
        this.logger.log({
            headers,
            payload,
        });
        return this.githubService.sendMsg(payload, type);
    }
}
