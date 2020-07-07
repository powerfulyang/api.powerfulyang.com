import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ActionType, Type } from './github.interfaces';
import { createHmac } from 'crypto';

@Injectable()
export class GitHubEventsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const restrictedEvents = this.reflector.get<Type[]>(
            'GithubWebhookEvents',
            context.getHandler(),
        );
        const restrictedActions = this.reflector.get<ActionType[]>(
            'GithubWebhookActions',
            context.getHandler(),
        );
        const request = context.switchToHttp().getRequest();
        const signature: string = request.headers['x-hub-signature'];
        const githubEvent: Type = request.headers['x-github-event'];

        return GitHubEventsGuard._checkValid(
            signature,
            githubEvent,
            restrictedEvents,
            restrictedActions,
            request.body,
        );
    }

    private static _checkValid(
        signature: string,
        githubEvent: Type,
        restrictedEvents: Type[],
        restrictedActions: ActionType[],
        payload: any,
    ): boolean {
        if (!signature) {
            throw new ForbiddenException(`This request doesn't contain a github signature`);
        }

        if (!restrictedEvents.includes(githubEvent)) {
            throw new ForbiddenException(`An unsupported webhook event was triggered`);
        }

        const { action } = payload;
        if (!restrictedActions.includes(action)) {
            throw new ForbiddenException(`An unsupported webhook action was triggered`);
        }

        return GitHubEventsGuard._checkSignature(signature, payload);
    }

    private static _checkSignature(signature: string, payload: any): boolean {
        const hmac = createHmac('sha1', <string>process.env.GITHUB_WEBHOOK_SECRET);
        const digest = 'sha1=' + hmac.update(JSON.stringify(payload)).digest('hex');

        if (signature !== digest) {
            throw new ForbiddenException(
                `Request body digest (${digest}) does not match ${signature}`,
            );
        }

        return true;
    }
}
