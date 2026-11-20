import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist',
      'public/mockServiceWorker.js',
      'playwright-report',
      'test-results',
    ],
  },
  ...tseslint.configs.recommended,
)
