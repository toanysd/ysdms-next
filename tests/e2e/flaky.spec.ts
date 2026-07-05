import { test, expect } from '@playwright/test';

test('Customer Search Flakiness Test', async ({ page }) => {
  test.setTimeout(90000);
  const customerCode = 'CUST-E2E-flakytest';
  
  // Create customer
  await page.goto('/master/customers/new');
  await page.fill('input[name="customer_code"]', customerCode);
  await page.fill('input[name="delivery_name"]', 'Delivery E2E');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/.*\/master\/customers$/, { timeout: 15000 });

  const custInput = page.getByPlaceholder('Gõ mã hoặc tên khách...').first();

  for (let i = 1; i <= 3; i++) {
    console.log(`\n--- Try ${i} ---`);
    await page.goto('/order/new');
    
    // We try exactly what the test does
    await custInput.fill('');
    await custInput.pressSequentially(customerCode, { delay: 100 });
    
    try {
      await expect(page.getByRole('list').getByText(customerCode).first()).toBeVisible({ timeout: 15000 });
      console.log(`Try ${i} successful!`);
    } catch (e) {
      console.error(`Try ${i} failed!`);
      // Take screenshot
      await page.screenshot({ path: `flaky-test-${i}.png` });
      throw e;
    }
  }
});
