interface _ProcessEnv {
  APP_ENV: 'dev' | 'qa' | 'prod';
  NODE_ENV: 'development' | 'production' | 'test';

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

  CLICK_UP_API_KEY: string;

  // Instagram
  IG_USERNAME: string;
  IG_PASSWORD: string;

  // npm
  npm_package_name: string;

  PORT: string;
  HOSTNAME: string;

  //
  BOT_SOCKS5_PROXY_HOST: string;
  BOT_SOCKS5_PROXY_PORT: string;

  // tg
  TELEGRAM_BOT_TOKEN: string;

  // amap
  AMAP_KEY: string;

  //
  IGNORE_METADATA: string;
}

declare module 'node:process' {
  global {
    namespace NodeJS {
      interface ProcessEnv extends _ProcessEnv {}
    }
  }
}
