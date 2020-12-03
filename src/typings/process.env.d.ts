declare namespace NodeJS {
  interface ProcessEnv {
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
  }
}
