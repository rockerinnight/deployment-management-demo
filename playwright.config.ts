import { defineConfig } from '@playwright/test'

const origin = 'http://localhost:4175'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: origin, channel: process.env.PLAYWRIGHT_CHANNEL },
  webServer: {
    command: 'npm run preview -- --host localhost --port 4175 --strictPort',
    url: origin,
    reuseExistingServer: false,
  },
})
