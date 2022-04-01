const tsconfigPathJest = require('tsconfig-paths-jest');
const tsconfig = require('./tsconfig.json');

const moduleNameMapper = tsconfigPathJest(tsconfig);

module.exports = {
  verbose: true,
  displayName: {
    name: 'api.powerfulyang.com.test',
    color: 'green',
  },
  moduleNameMapper,
  maxConcurrency: 5,
  moduleFileExtensions: ['js', 'json', 'ts', 'node'],
  setupFiles: ['./.jest/loadTestEnv.ts'],
  setupFilesAfterEnv: ['./.jest/jest.setup.ts'],
  rootDir: '.',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testPathIgnorePatterns: ['node_modules'],
  testEnvironment: 'node',
};
