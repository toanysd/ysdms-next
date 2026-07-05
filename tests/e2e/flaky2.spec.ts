import { test, expect } from '@playwright/test';

test('Customer Search Flakiness Test Exact', async ({ page }) => {
  test.setTimeout(90000);
  const customerCode = 'CUST-E2E-flakytest2';
  
  // 1. Customer Contact
  await page.goto('/master/customers');
  await page.click('a[href="/master/customers/new"]');
  await expect(page).toHaveURL(/.*\/master\/customers\/new/, { timeout: 60000 });
  
  await page.fill('input[name="customer_code"]', customerCode);
  await page.fill('input[name="delivery_name"]', 'Delivery E2E');
  await page.fill('input[name="customer_name_jp"]', 'Customer Name JP E2E');
  
  await Promise.all([
    page.waitForURL(/.*\/master\/customers$/, { timeout: 30000 }),
    page.locator('button[type="submit"]').click()
  ]);

  for (let i = 1; i <= 3; i++) {
    console.log(`\n--- Try ${i} ---`);
    await page.goto('/order/new');
    
    await page.selectOption('select[name="order_type"]', { value: 'molding' });
    await page.fill('input[name="slip_no"]', `E2E-M1-${i}`);

    const custInput = page.getByPlaceholder('Gõ mã hoặc tên khách...').first();
    await custInput.fill('');
    await custInput.pressSequentially(customerCode, { delay: 100 });
    
    try {
      await expect(page.getByRole('list').getByText(customerCode).first()).toBeVisible({ timeout: 15000 });
      console.log(`Try ${i} successful!`);
    } catch (e) {
      console.error(`Try ${i} failed!`);
      throw e;
    }
  }
});
