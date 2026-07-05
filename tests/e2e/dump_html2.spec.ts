import { test } from '@playwright/test';
const fs = require('fs');

test('dump html product new', async ({ page }) => {
  await page.goto('/master/product/new');
  await page.waitForTimeout(3000);
  
  const content = await page.content();
  fs.writeFileSync('product_new_page.html', content);
});
