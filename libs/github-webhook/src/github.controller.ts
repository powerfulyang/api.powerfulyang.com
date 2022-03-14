import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { IHeader, Payload } from './github.interfaces';
import { GitHubEventsGuard } from './github-event.guard';
import { GithubWebhookEvents } from './github.decorator';
import { EventType } from './github.enum';
import type { WebhookPayload } from './payload/webhook-payload';

@Controller('github-webhook')
export class GithubController {
  private readonly test;

  constructor() {
    this.test = 'test';
  }

  @UseGuards(GitHubEventsGuard)
  @GithubWebhookEvents(Object.values(EventType))
  @Post()
  async getWebhook<T extends WebhookPayload>(
    @Body() payload: Payload<T>,
    @Headers() headers: IHeader,
  ) {
    const type: EventType = headers['x-github-event'];
    return { payload, type, test: this.test };
  }
}
