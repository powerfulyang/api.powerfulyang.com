declare module '@waylaidwanderer/chatgpt-api';

// temporarily fix
declare module 'graphql-request/build/cjs/types' {
  export type GraphQLClientRequestHeaders = Headers | string[][] | Record<string, string>;
}
