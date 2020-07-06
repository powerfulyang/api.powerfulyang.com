module.exports = {
    verbose: true,
    displayName: {
        name: 'api.powerfulyang.com.test',
        color: 'green',
    },
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
