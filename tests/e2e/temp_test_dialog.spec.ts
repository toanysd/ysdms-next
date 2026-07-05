import { test, expect } from '@playwright/test';

test.describe('Dialog test', () => {
  test('should hang on unexpected dialog', async ({ page }) => {
    page.on('dialog', async dialog => {
      const msg = dialog.message().toLowerCase();
      const isSuccess = /(th\u00E0nh c\u00F4ng|success)/.test(msg) && 
                        !/(unsuccess|not\s+success|fail|error|l\u1ED7i|kh\u00F4ng\s+th\u00E0nh\s+c\u00F4ng)/.test(msg);

      if (isSuccess) {
        await dialog.accept();
        return;
      }
      throw new Error(`Unexpected dialog: ${dialog.message()}`);
    });

    await page.goto('data:text/html,<button onclick="alert(\'Unexpected Error\')">Click me</button>');
    await page.click('button');
    console.log("Clicked!");
    await page.locator('body').click({ timeout: 2000 });
    console.log("Completed!");
  });
});
