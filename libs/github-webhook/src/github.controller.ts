import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { IHeader, Payload } from './github.interfaces';
import { GithubService } from './github.service';
import { GitHubEventsGuard } from './github-event.guard';
import { GithubWebhookEvents } from './github.decorator';
import { EventType } from './github.enum';
import { WebhookPayload } from './payload/webhook-payload';

@Controller('github-webhook')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @UseGuards(GitHubEventsGuard)
  @GithubWebhookEvents(Object.values(EventType))
  @Post()
  async getWebhook<T extends WebhookPayload>(
    @Body() payload: Payload<T>,
    @Headers() headers: IHeader,
  ) {
    const type: EventType = headers['x-github-event'];
    return this.githubService.dealWebHook(payload, type);
  }
}
