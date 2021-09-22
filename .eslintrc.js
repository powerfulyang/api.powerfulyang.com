module.exports = {
  extends: [require.resolve('@powerfulyang/lint/dist/eslint')],
  ignorePatterns: ['**/*.spec.ts'],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      1,
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: true,
      },
    ],
  },
};
