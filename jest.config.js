// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsconfig = require('./tsconfig.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

module.exports = {
    verbose: true,
    displayName: {
        name: 'api.powerfulyang.com.test',
        color: 'green',
    },
    moduleNameMapper,
    maxConcurrency: 5,
    moduleFileExtensions: ['js', 'json', 'ts'],
    setupFiles: ['./.jest/setEnvVars.ts'],
    rootDir: '.',
    testRegex: '.spec.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    testEnvironment: 'node',
};
