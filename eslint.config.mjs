import eslintNextPlugin from 'eslint-config-next';
import nextVitals from 'eslint-config-next/core-web-vitals';
import reactPlugin from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...eslintNextPlugin,
  // Override default ignores of eslint-config-next.
  {
    plugins: {
      react: reactPlugin,
    },
    rules: {
      'react/no-unknown-property': 'error',
      'react/no-unescaped-entities': 'off',
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.wrangler',
    '.open-next',
    'node_modules',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
