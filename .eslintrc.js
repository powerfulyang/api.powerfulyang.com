module.exports = {
    extends: [require.resolve('@powerfulyang/lint/dist/eslint')],
    rules: {
        'class-methods-use-this': 0,
        'no-await-in-loop': 0,
    },
    ignorePatterns: ['**/*.spec.ts'],
};
