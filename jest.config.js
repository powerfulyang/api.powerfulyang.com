const { pathsToModuleNameMapper } = require('@powerfulyang/lint');
const tsconfig = require('./tsconfig.json');

const moduleNameMapper = pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
  prefix: '<rootDir>/',
});

/**
 * @type {import('ts-jest').InitialOptionsTsJest}
 */
module.exports = {
  moduleNameMapper,
  maxConcurrency: 5,
  preset: 'ts-jest',
  setupFiles: ['./.jest/loadTestEnv.ts'],
  setupFilesAfterEnv: ['./.jest/jest.setup.ts'],
  testRegex: '.spec.ts$',
  testPathIgnorePatterns: ['node_modules'],
  testEnvironment: 'node',
};
