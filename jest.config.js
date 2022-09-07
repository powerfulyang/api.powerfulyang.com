const { pathsToModuleNameMapper } = require('@powerfulyang/lint');
const tsconfig = require('./tsconfig.json');

const moduleNameMapper = pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
  prefix: '<rootDir>/',
});

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  moduleNameMapper,
  transform: {
    '^.+\\.ts$': '@swc/jest',
  },
  setupFiles: ['./.jest/loadTestEnv.ts'],
  setupFilesAfterEnv: ['./.jest/jest.setup.ts'],
};
