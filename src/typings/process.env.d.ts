type IProcessEnv = {
  NODE_ENV: string;
  JWT_SECRET: string;

  GOOGLE_OAUTH_CLIENT_ID: string;
  GOOGLE_OAUTH_CLIENT_SECRET: string;
  GOOGLE_OAUTH_CALLBACK_URL: string;

  MYSQL_HOST: string;
  MYSQL_PORT: string;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
  MYSQL_DATABASE: string;

  RABBIT_MQ_HOST: string;
  RABBIT_MQ_PORT: string;

  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_PASS: string;

  ELASTICSEARCH_HOST: string;
  ELASTICSEARCH_PORT: string;
  ELASTICSEARCH_USER: string;
  ELASTICSEARCH_PASS: string;

  SERVER_HOST_DOMAIN: string;

  PG_HOST: string;
  PG_PORT: string;
  PG_USER: string;
  PG_PASSWORD: string;
  PG_DATABASE: string;

  HOSTNAME: string;
};

export declare global {
  namespace NodeJS {
    interface ProcessEnv extends IProcessEnv {}
  }
}
