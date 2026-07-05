import { test } from '@playwright/test';
const fs = require('fs');

test('dump links', async ({ page }) => {
  await page.goto('/master/customers');
  await page.waitForTimeout(5000);
  
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => `${a.href} | ${a.textContent?.trim()}`);
  });
  
  fs.writeFileSync('links_output.txt', links.join('\n'));
});
