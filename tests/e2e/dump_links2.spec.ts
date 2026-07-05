import { test } from '@playwright/test';
const fs = require('fs');

test('dump product links', async ({ page }) => {
  await page.goto('/master/product');
  await page.waitForTimeout(5000);
  
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => `${a.href} | ${a.textContent?.trim()}`);
  });
  
  fs.writeFileSync('product_links.txt', links.join('\n'));
});
