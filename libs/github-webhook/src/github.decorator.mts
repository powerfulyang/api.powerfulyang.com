import { SetMetadata } from '@nestjs/common';
import type { EventType } from './github.enum.mjs';

export const GithubWebhookEvents = (events: EventType[]) => SetMetadata('GithubWebhookEvents', events);
