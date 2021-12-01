import type { WebhookPayload } from './webhook-payload.mjs';
import type { Repository } from './repository-webhook-payload.mjs';

export interface ForkPayload extends WebhookPayload {
  forkee: Repository;
}
