import { test, expect } from '@playwright/test';

test('unhandled rejection test', async ({ page }) => {
  let unhandled = false;
  process.on('unhandledRejection', (reason) => {
    console.error('CAUGHT UNHANDLED REJECTION:', reason);
    unhandled = true;
  });

  page.on('dialog', async dialog => {
    throw new Error('Boom!');
  });

  await page.setContent('<button onclick="alert(\'Failed!\')">Click me</button>');
  await page.locator('button').click();
  await expect(page.locator('button')).toHaveText('Done', { timeout: 1000 });
  
  if (unhandled) {
    console.log("There was an unhandled promise rejection.");
  }
});
