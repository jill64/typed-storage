import { test, expect } from '@playwright/test'

test('Test', async ({ page }) => {
  await page.goto('/')

  const buttons = await page.getByRole('button').all()

  for (const button of buttons) {
    const id = await button.getAttribute('data-test-id')
    if (id) {
      await button.click()
      await expect(page.getByText(`Passed: ${id}`)).toBeVisible()
      console.log(`Passed: ${id}`)
    }
  }
})
