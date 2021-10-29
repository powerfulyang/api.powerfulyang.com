import { SetMetadata } from '@nestjs/common';
import type { EventType } from './github.enum';

export const GithubWebhookEvents = (events: EventType[]) => SetMetadata('GithubWebhookEvents', events);
