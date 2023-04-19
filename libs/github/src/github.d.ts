interface _ProcessEnv {
  GITHUB_TOKEN: string;
}

declare module 'node:process' {
  global {
    namespace NodeJS {
      interface ProcessEnv extends _ProcessEnv {}
    }
  }
}
