interface _ProcessEnv {}

declare module 'node:process' {
  global {
    namespace NodeJS {
      interface ProcessEnv extends _ProcessEnv {}
    }
  }
}
