import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'github-schema.graphql',
  generates: {
    'src/libs/github/__generated__/github-graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
        {
          add: {
            content: `import 'graphql';`,
          },
        },
      ],
      config: {
        avoidOptionals: true,
      },
    },
  },
  documents: 'src/libs/github/graphql/*.graphql',
};

export default config;
