import type { WebhookPayload } from './webhook-payload.mjs';

export interface StarPayload extends WebhookPayload {
  action: string;
}
