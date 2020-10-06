declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET: string;
        GOOGLE_OAUTH_CLIENT_ID: string;
        GOOGLE_OAUTH_CLIENT_SECRET: string;
        GOOGLE_OAUTH_CALLBACK_URL: string;
    }
}
