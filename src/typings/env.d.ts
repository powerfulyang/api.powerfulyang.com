declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    JWT_SECRET: string;

    RABBIT_MQ_HOST: string;
    RABBIT_MQ_PORT: string;

    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASS: string;

    ELASTICSEARCH_HOST: string;
    ELASTICSEARCH_PORT: string;
    ELASTICSEARCH_USER: string;
    ELASTICSEARCH_PASS: string;

    PG_HOST: string;
    PG_PORT: string;
    PG_USER: string;
    PG_PASSWORD: string;
    PG_DATABASE: string;

    SERVER_ORIGIN: string;

    WECHAT_APP_ID: string;
    WECHAT_APP_SECRET: string;

    WECHAT_MINI_APP_ID: string;
    WECHAT_MINI_APP_SECRET: string;
    WECHAT_MINI_APP_TOKEN: string;
    WECHAT_MINI_APP_AES_KEY: string;

    AMAP_KEY: string;
  }
}
