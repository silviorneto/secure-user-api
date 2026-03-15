import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    env: {
      DATABASE_URL: process.env.TEST_DATABASE_URL ?? 'postgresql://apiuser:changeme@localhost:5432/secureapi_test',
      JWT_SECRET: 'test-secret-min-32-chars-for-vitest',
      JWT_EXPIRES_IN: '15m',
      ALLOWED_ORIGIN: 'http://localhost:5173',
      PORT: '3001',
    },
  },
})
