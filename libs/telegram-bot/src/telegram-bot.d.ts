interface _ProcessEnv {
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
