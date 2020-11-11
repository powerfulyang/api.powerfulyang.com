import { WebhookPayload } from './webhook-payload';
import { Repository } from './repository-webhook-payload';

export interface ForkPayload extends WebhookPayload {
  forkee: Repository;
}
