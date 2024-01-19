const { eslint } = require('@powerfulyang/lint');

module.exports = {
  ...eslint,
  overrides: eslint.overrides.map((override) => ({
    ...override,
    rules: {
      ...override.rules,
      'no-await-in-loop': 'off',
      'import/no-cycle': 'off',
      'max-classes-per-file': 'off',
    },
  })),
};
