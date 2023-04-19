interface _ProcessEnv {
  BOT_SOCKS5_PROXY_HOST: string;
  BOT_SOCKS5_PROXY_PORT: string;
  TELEGRAM_BOT_TOKEN: string;
  MY_CHAT_ID: string;
}

declare module 'node:process' {
  global {
    namespace NodeJS {
      interface ProcessEnv extends _ProcessEnv {}
    }
  }
}
