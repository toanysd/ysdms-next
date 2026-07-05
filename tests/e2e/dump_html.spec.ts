import { test } from '@playwright/test';
const fs = require('fs');

test('dump html', async ({ page }) => {
  await page.goto('/master/products/new');
  await page.waitForTimeout(5000);
  
  const content = await page.content();
  fs.writeFileSync('product_new.html', content);
});
