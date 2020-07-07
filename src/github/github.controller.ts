import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { IHeader, IParam, Type } from './github.interfaces';
import { GithubService } from './github.service';
import { GitHubEventsGuard } from './github-event.guard';
import { GithubWebhookActions, GithubWebhookEvents } from './github.decorator';

@Controller('github')
export class GithubController {
    constructor(private readonly githubService: GithubService) {}

    @UseGuards(GitHubEventsGuard)
    @GithubWebhookEvents(['issues', 'pull_request'])
    @GithubWebhookActions(['opened', 'closed'])
    @Post()
    async getWebhook(@Body() params: IParam, @Headers() headers: IHeader) {
        const type: Type = headers['x-github-event'];

        return this.githubService.sendMsg(params, type);
    }
}
