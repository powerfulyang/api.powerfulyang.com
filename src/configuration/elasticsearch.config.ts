import type { ClientOptions } from '@elastic/elasticsearch';

export const elasticsearchConfig = (): ClientOptions => {
  const host = process.env.ELASTICSEARCH_HOST;
  const port = process.env.ELASTICSEARCH_PORT;
  const username = process.env.ELASTICSEARCH_USER as string;
  const password = process.env.ELASTICSEARCH_PASS as string;
  let auth: any;
  if (username && password) {
    auth = { username, password };
  }
  return { node: `http://${host}:${port}`, auth };
};
