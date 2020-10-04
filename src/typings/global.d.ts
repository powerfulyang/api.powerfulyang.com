declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET: string;
        BOT_SOCKS5_PROXY_HOST: string;
        BOT_SOCKS5_PROXY_PORT: string;
        TELEGRAM_BOT_TOKEN: string;
        TELEGRAM_BOT_BAN_POLLING: string;
        MY_CHAT_ID: string;
        GITHUB_WEBHOOK_SECRET: string;
        IG_USERNAME: string;
        IG_PASSWORD: string;
        PIXIV_BOT_COOKIE: string;
    }
}
