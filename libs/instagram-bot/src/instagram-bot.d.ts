interface _ProcessEnv {
  IG_USERNAME: string;
  IG_PASSWORD: string;
}

declare module 'node:process' {
  global {
    namespace NodeJS {
      interface ProcessEnv extends _ProcessEnv {}
    }
  }
}
