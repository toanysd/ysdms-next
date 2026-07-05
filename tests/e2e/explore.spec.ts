import { test } from '@playwright/test';
import fs from 'fs';

test('dump product list', async ({ page }) => {
  await page.goto('/master/product');
  await page.waitForTimeout(2000);
  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input')).map(el => ({
      placeholder: el.placeholder
    }));
  });
  fs.writeFileSync('e2e_product_list_dump.json', JSON.stringify(inputs, null, 2));
});
