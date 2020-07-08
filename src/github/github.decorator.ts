import { SetMetadata } from '@nestjs/common';
import { EventType } from './github.enum';

export const GithubWebhookEvents = (events: EventType[]) => {
    return SetMetadata('GithubWebhookEvents', events);
};
