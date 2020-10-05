import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { createHmac } from 'crypto';
import { EventType } from './github.enum';
import { Payload } from './github.interfaces';
import { WebhookPayload } from './payload/webhook-payload';

@Injectable()
export class GitHubEventsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const restrictedEvents = this.reflector.get<EventType[]>(
            'GithubWebhookEvents',
            context.getHandler(),
        );
        const request = context.switchToHttp().getRequest();
        const signature: string = request.headers['x-hub-signature'];
        const githubEvent: EventType =
            request.headers['x-github-event'];

        return GitHubEventsGuard._checkValid(
            signature,
            githubEvent,
            restrictedEvents,
            request.body,
        );
    }

    private static _checkValid(
        signature: string,
        githubEvent: EventType,
        restrictedEvents: EventType[],
        payload: Payload<WebhookPayload>,
    ): boolean {
        if (!signature) {
            throw new ForbiddenException(
                `This request doesn't contain a github signature`,
            );
        }

        if (!restrictedEvents.includes(githubEvent)) {
            throw new ForbiddenException(
                `An unsupported webhook event was triggered`,
            );
        }

        return GitHubEventsGuard._checkSignature(signature, payload);
    }

    private static _checkSignature(
        signature: string,
        payload: Payload<WebhookPayload>,
    ): boolean {
        const hmac = createHmac(
            'sha1',
            process.env.GITHUB_WEBHOOK_SECRET,
        );
        const digest = `sha1=${hmac
            .update(JSON.stringify(payload))
            .digest('hex')}`;

        if (signature !== digest) {
            throw new ForbiddenException(
                `Request body digest (${digest}) does not match ${signature}`,
            );
        }

        return true;
    }
}
