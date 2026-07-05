import { test } from '@playwright/test';

test('dump products new form', async ({ page }) => {
  await page.goto('/master/products/new');
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: 'product_new_screenshot.png', fullPage: true });
});
