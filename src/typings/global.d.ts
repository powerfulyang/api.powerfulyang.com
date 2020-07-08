declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET: string;
        TELEGRAM_BOT_SOCKS5_PROXY: string;
        TELEGRAM_BOT_TOKEN: string;
        MY_CHAT_ID: string;
        GITHUB_WEBHOOK_SECRET: string;
    }
}
