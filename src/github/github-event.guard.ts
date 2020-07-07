import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Type, ActionType } from './github.interfaces';
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
        const { secretToken } = request.params;

        return this._checkValid(
            signature,
            githubEvent,
            restrictedEvents,
            restrictedActions,
            request.body,
            secretToken,
        );
    }

    private _checkValid(
        signature: string,
        githubEvent: Type,
        restrictedEvents: Type[],
        restrictedActions: ActionType[],
        payload: any,
        secretToken: string,
    ): boolean {
        if (!signature) {
            throw new UnauthorizedException(`This request doesn't contain a github signature`);
        }

        if (!restrictedEvents.includes(githubEvent)) {
            throw new UnauthorizedException(`An unsupported webhook event was triggered`);
        }

        const { action } = payload;
        if (!restrictedActions.includes(action)) {
            throw new UnauthorizedException(`An unsupported webhook action was triggered`);
        }

        return GitHubEventsGuard._checkSignature(signature, payload, secretToken);
    }

    private static _checkSignature(signature: string, payload: any, secretToken: string): boolean {
        const hmac = createHmac('sha1', secretToken);
        const digest = 'sha1=' + hmac.update(JSON.stringify(payload)).digest('hex');

        if (!secretToken || signature !== digest) {
            throw new UnauthorizedException(
                `Request body digest (${digest}) does not match ${signature}`,
            );
        }

        return true;
    }
}
