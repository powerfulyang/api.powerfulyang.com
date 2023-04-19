import type { ClientOptions } from '@elastic/elasticsearch';
import process from 'node:process';

export const elasticsearchConfig = (): ClientOptions => {
  const host = process.env.ELASTICSEARCH_HOST as string;
  const port = process.env.ELASTICSEARCH_PORT as string;
  const username = process.env.ELASTICSEARCH_USER;
  const password = process.env.ELASTICSEARCH_PASS;
  let auth;
  if (username && password) {
    auth = { username, password };
  }
  return { node: `http://${host}:${port}`, auth };
};
