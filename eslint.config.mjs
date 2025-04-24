// eslint.config.js
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      indent: ['error', 2],
      'no-var': 'error',
      'prefer-const': 'error',
      'comma-dangle': ['error', 'never'],
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',
      ...prettierConfig.rules,
    },
  },
];
