import type { OrganizationWebhookPayload } from './organization-webhook-payload';
import type { RepositoryWebhookPayload } from './repository-webhook-payload';
import type { InstallationWebhookPayload } from './installation-webhook-payload';

export interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface WebhookPayload
  extends OrganizationWebhookPayload,
    RepositoryWebhookPayload,
    InstallationWebhookPayload {
  sender: User;
  action: string;
}
