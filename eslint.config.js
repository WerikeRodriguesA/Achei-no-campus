import eslint from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

const config = tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
  {
    // features/ não deve importar de api/mock/ nem api/http/
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '.*api/mock/.*',
              message: 'features não devem importar de api/mock; usar api/index.ts.',
            },
            {
              regex: '.*api/http/.*',
              message: 'api/http ainda não deve ser usado no protótipo v0.1.',
            },
          ],
        },
      ],
    },
  },
  {
    // domain/ não deve importar de api/ nem de React/libs externas
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { regex: '.*api/.*', message: 'domain não deve importar de api.' },
            { regex: '^react', message: 'domain não deve importar de React.' },
            { regex: '^@types/', message: 'domain não deve importar de tipos externos.' },
          ],
        },
      ],
    },
  },
  {
    // apenas api/index.ts escolhe o adaptador mock
    files: ['src/api/index.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '.*api/http/.*',
              message: 'api/index.ts deve apontar para api/mock/ no protótipo v0.1.',
            },
          ],
        },
      ],
    },
  },
  prettier,
);

export default config;
export { config };
