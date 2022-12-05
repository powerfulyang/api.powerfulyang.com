import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { IHeader, Payload } from './github.interfaces';
import { GitHubEventsGuard } from './github-event.guard';
import { GithubWebhookEvents } from './github.decorator';
import { EventType } from './github.enum';
import type { WebhookPayload } from './payload/webhook-payload';

@Controller('github-webhook')
@ApiExcludeController()
export class GithubController {
  private readonly test;

  constructor() {
    this.test = 'test';
  }

  @UseGuards(GitHubEventsGuard)
  @GithubWebhookEvents(Object.values(EventType))
  @Post()
  getWebhook<T extends WebhookPayload>(@Body() payload: Payload<T>, @Headers() headers: IHeader) {
    const type: EventType = headers['x-github-event'];
    return { payload, type, test: this.test };
  }
}
