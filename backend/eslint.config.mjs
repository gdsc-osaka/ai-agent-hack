import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
// import tsPlugin from '@typescript-eslint/eslint-plugin';
// import totalFunctions from 'eslint-plugin-total-functions';

const myRules = {
  rules: {
    '@typescript-eslint/no-namespace': 'off',
    'linebreak-style': ['error', 'unix'],
  },
};

export default tseslint.config(
  {
    ignores: ['src/grpc/**/*.{ts,js}'],
  },
  {
    languageOptions: { globals: globals.node },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      // 'total-functions': totalFunctions,
      // '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      // 'total-functions/no-unsafe-type-assertion': 'error',
      ...myRules.rules,
    },
  },
  {
    files: ['test/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./test/tsconfig.json",
      },
    },
    plugins: {
      // FIXME: totalFunctions は as のアップキャストを禁止するために使用したい. parserOptions.project でエラーになるため停止中
      // 'total-functions': totalFunctions,
      // '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      // 'total-functions/no-unsafe-type-assertion': 'error',
      ...myRules.rules,
    },
  },
);