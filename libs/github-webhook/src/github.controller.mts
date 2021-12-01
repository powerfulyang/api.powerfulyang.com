import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { IHeader, Payload } from './github.interfaces.mjs';
import { GithubService } from './github.service.mjs';
import { GitHubEventsGuard } from './github-event.guard.mjs';
import { GithubWebhookEvents } from './github.decorator.mjs';
import { EventType } from './github.enum.mjs';
import type { WebhookPayload } from './payload/webhook-payload.mjs';

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
