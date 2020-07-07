import { SetMetadata } from '@nestjs/common';
import { Type, ActionType } from './github.interfaces';

export const GithubWebhookEvents = (events: Type[]) => {
    return SetMetadata('GithubWebhookEvents', events);
};

export const GithubWebhookActions = (actions: ActionType[]) => {
    return SetMetadata('GithubWebhookActions', actions);
};
