import { test, expect } from '@playwright/test';

test('dialog test', async ({ page }) => {
  page.on('dialog', async dialog => {
    try {
        expect(false).toBeTruthy();
        await dialog.dismiss();
    } catch (e) {
        throw e;
    }
  });

  await page.setContent('<button onclick="alert(\'Failed!\')">Click me</button>');
  await page.locator('button').click();
  await expect(page.locator('button')).toHaveText('Done', { timeout: 2000 });
});
