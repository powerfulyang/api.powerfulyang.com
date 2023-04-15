const { pathsToModuleNameMapper } = require('@powerfulyang/lint');
const tsconfig = require('./tsconfig.json');

const moduleNameMapper = pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
  prefix: '<rootDir>/',
});

/** @type {import('jest').Config} */
module.exports = {
  moduleNameMapper,
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': '@swc/jest',
  },
  setupFiles: ['./.jest/loadTestEnv.ts'],
  setupFilesAfterEnv: ['./.jest/jest.setup.ts'],
  reporters: process.env.CI && [
    [
      'github-actions',
      {
        silent: false,
      },
    ],
    'summary',
  ],
};
