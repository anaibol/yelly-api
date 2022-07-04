module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'functional', 'simple-import-sort', 'unused-imports'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'plugin:functional/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off', // https://github.com/typescript-eslint/typescript-eslint/issues/2972
    'no-unused-vars': 'off',
    'functional/no-class': 'off',
    'functional/functional-parameters': 'off',
    'functional/no-this-expression': 'off',
    'functional/no-conditional-statement': 'off',
    'functional/no-expression-statement': 'off',
    'functional/prefer-readonly-type': 'off',
    'simple-import-sort/imports': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
  },
}
