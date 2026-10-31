import { Linter } from 'eslint';
import { describe, expect, it } from 'vitest';

const linter = new Linter({ configType: 'flat' });

interface Pattern {
  regex: string;
  message: string;
}

type NoRestrictedImports = ['error', { patterns: Pattern[] }];

const configFor = (files: string | string[], patterns: Pattern[]) => [
  {
    files: [files],
    rules: {
      'no-restricted-imports': ['error', { patterns }] as NoRestrictedImports,
    },
  },
];

describe('regra de dependência entre camadas', () => {
  it('rejeita que uma feature importe de api/mock', () => {
    const messages = linter.verify(
      `import { api } from '../../api/mock/adapter';`,
      configFor('src/features/**/*.{ts,tsx}', [
        { regex: '.*api/mock/.*', message: 'features não devem importar de api/mock.' },
      ]),
      'src/features/post-detail/index.ts',
    );
    expect(messages).toHaveLength(1);
    expect(messages[0]?.ruleId).toBe('no-restricted-imports');
  });

  it('rejeita que domain importe de react', () => {
    const messages = linter.verify(
      `import { useState } from 'react';`,
      configFor('src/domain/**/*.{ts,tsx}', [
        { regex: '^react', message: 'domain não deve importar de React.' },
      ]),
      'src/domain/post-status.ts',
    );
    expect(messages).toHaveLength(1);
    expect(messages[0]?.ruleId).toBe('no-restricted-imports');
  });
});
