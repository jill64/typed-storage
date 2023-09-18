import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    includeSource: ['./**/*.{js,ts}'],
    coverage: { reporter: ['json', 'text'] },
    environment: 'jsdom'
  }
})
