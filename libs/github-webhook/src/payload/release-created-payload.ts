import type { WebhookPayload } from './webhook-payload';

export interface ReleaseCreatedPayload extends WebhookPayload {
  action:
    | 'unpublished'
    | 'published'
    | 'created'
    | 'edited'
    | 'deleted'
    | 'prereleased'
    | 'released';
  release: {
    html_url: string;
    tag_name: string;
  };
}
