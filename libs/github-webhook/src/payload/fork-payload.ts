import type { WebhookPayload } from './webhook-payload';
import type { Repository } from './repository-webhook-payload';

export interface ForkPayload extends WebhookPayload {
  forkee: Repository;
}
