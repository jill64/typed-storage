import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    includeSource: ['./**/*.{js,ts}'],
    environment: 'happy-dom'
  }
})