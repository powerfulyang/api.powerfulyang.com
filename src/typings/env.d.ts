import type { Dict } from '@powerfulyang/utils';

declare module 'node:process' {
  global {
    namespace NodeJS {
      interface ProcessEnv extends Dict<string> {
        APP_ENV: string;
        NODE_ENV: string;

        // JWT
        JWT_SECRET: string;
        JWT_EXPIRES_IN: string;

        // RabbitMQ
        RABBIT_MQ_HOST: string;
        RABBIT_MQ_PORT: string;

        // Redis
        REDIS_HOST: string;
        REDIS_PORT: string;
        REDIS_PASS: string;

        // Elasticsearch
        ELASTICSEARCH_HOST: string;
        ELASTICSEARCH_PORT: string;
        ELASTICSEARCH_USER: string;
        ELASTICSEARCH_PASS: string;

        // Postgres
        PG_HOST: string;
        PG_PORT: string;
        PG_USER: string;
        PG_PASSWORD: string;
        PG_DATABASE: string;

        SERVER_ORIGIN: string;

        WECHAT_OFFICIAL_ACCOUNT_APP_ID: string;
        WECHAT_OFFICIAL_ACCOUNT_APP_SECRET: string;
        WECHAT_OFFICIAL_ACCOUNT_TOKEN: string;
        WECHAT_OFFICIAL_ACCOUNT_ENCODING_AES_KEY: string;

        WECHAT_MINI_PROGRAM_APP_ID: string;
        WECHAT_MINI_PROGRAM_APP_SECRET: string;
        WECHAT_MINI_PROGRAM_TOKEN: string;
        WECHAT_MINI_PROGRAM_ENCODING_AES_KEY: string;

        ALGOLIA_CRAWLER_ID: string;
        ALGOLIA_CRAWLER_USER_ID: string;
        ALGOLIA_CRAWLER_API_KEY: string;

        VAPID_PRIVATE_KEY: string;
      }
    }
  }
}
