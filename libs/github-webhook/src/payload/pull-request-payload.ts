import { RepositoryWebhookPayload } from './repository-webhook-payload';
import { User } from './webhook-payload';

export interface PullRequestPayload extends RepositoryWebhookPayload {
    action:
        | 'assigned'
        | 'unassigned'
        | 'review_requested'
        | 'review_request_removed'
        | 'labeled'
        | 'unlabeled'
        | 'opened'
        | 'edited'
        | 'closed'
        | 'ready_for_review'
        | 'locked'
        | 'unlocked'
        | 'reopened'
        | 'synchronize';
    pull_request: {
        url: string;
        id: number;
        node_id: string;
        html_url: string;
        diff_url: string;
        patch_url: string;
        issue_url: string;
        number: number;
        state: 'open' | 'closed';
        locked: boolean;
        title: string;
        user: User;
        body: string;
        merged?: boolean;
    };
}
