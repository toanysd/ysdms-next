import { test, expect } from '@playwright/test';

test('dialog test', async ({ page }) => {
  page.on('dialog', async dialog => {
    throw new Error(`Unexpected dialog: ${dialog.message()}`);
  });

  await page.setContent('<script>alert("test")</script>');
  await page.waitForTimeout(1000);
  console.log("End of test");
});
