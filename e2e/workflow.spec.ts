import { test, expect } from '@playwright/test';

test.describe('Order Creation Flow', () => {
  test('should create customer and orders', async ({ page }) => {
    page.on('dialog', dialog => {
      dialog.accept();
    });
    
    // 1. Customer Contact
    await page.goto('/master/customers');
    await page.click('a[href="/master/customers/new"]');
    await expect(page).toHaveURL(/.*\/master\/customers\/new/);
    
    await page.fill('input[name="customer_code"]', 'CUST-E2E-01');
    await page.fill('input[name="delivery_name"]', 'Delivery E2E');
    await page.fill('input[name="customer_name_jp"]', 'Customer Name JP E2E');
    
    let responsePromise = page.waitForResponse(res => res.request().method() === 'POST');
    await page.locator('button[type="submit"]').click();
    await responsePromise;

    await page.goto('/master/customers');
    await page.fill('input[placeholder="Tìm mã hoặc tên khách hàng..."]', 'CUST-E2E-01');
    await expect(page.getByText('CUST-E2E-01').first()).toBeVisible({ timeout: 15000 });

    // 2. Tray Design Order
    await page.goto('/order');
    await page.click('a[href="/order/new"]');
    await expect(page).toHaveURL(/.*\/order\/new/);

    await page.selectOption('select[name="order_type"]', { label: 'Design Tray (Thiết kế Khay)' });
    await page.fill('input[name="slip_no"]', 'E2E-D1-' + Date.now());
    
    await page.fill('input[placeholder="Gõ mã hoặc tên khách..."]', 'CUST-E2E-01');
    await expect(page.locator('ul').getByText('CUST-E2E-01').first()).toBeVisible();
    await page.locator('ul').getByText('CUST-E2E-01').first().click();

    await page.click('button:has-text("Thêm Dòng")');
    
    const pnInput = page.locator('input[placeholder*="P/N"]');
    await pnInput.first().fill('TRAY-DESIGN-001');
    await page.locator('table tbody tr').first().locator('input[type="number"]').first().fill('100');
    
    responsePromise = page.waitForResponse(res => res.request().method() === 'POST');
    await page.locator('button[type="submit"]').click();
    await responsePromise;
    // Workaround for Next.js router.push + router.refresh bug causing navigation to fail
    await page.goto('/order');

    // 3. Tray Production Order
    await page.click('a[href="/order/new"]');
    await expect(page).toHaveURL(/.*\/order\/new/);

    await page.selectOption('select[name="order_type"]', { label: 'Molding (Đúc khuôn Mass)' });
    await page.fill('input[name="slip_no"]', 'E2E-M1-' + Date.now());
    
    await page.fill('input[placeholder="Gõ mã hoặc tên khách..."]', 'CUST-E2E-01');
    await expect(page.locator('ul').getByText('CUST-E2E-01').first()).toBeVisible();
    await page.locator('ul').getByText('CUST-E2E-01').first().click();

    await page.click('button:has-text("Thêm Dòng")');
    
    await pnInput.first().fill('TRAY-MASS-001');
    await page.locator('table tbody tr').first().locator('input[type="number"]').first().fill('100');
    
    responsePromise = page.waitForResponse(res => res.request().method() === 'POST');
    await page.locator('button[type="submit"]').click();
    await responsePromise;
    await page.goto('/order');

    // 4. Mold Order
    await page.click('a[href="/order/new"]');
    await expect(page).toHaveURL(/.*\/order\/new/);

    await page.selectOption('select[name="order_type"]', { label: 'Design Mold (Thiết kế Khuôn)' });
    await page.fill('input[name="slip_no"]', 'E2E-DM1-' + Date.now());
    
    await page.fill('input[placeholder="Gõ mã hoặc tên khách..."]', 'CUST-E2E-01');
    await expect(page.locator('ul').getByText('CUST-E2E-01').first()).toBeVisible();
    await page.locator('ul').getByText('CUST-E2E-01').first().click();

    await page.click('button:has-text("Thêm Dòng")');
    
    await pnInput.first().fill('MOLD-DESIGN-001');
    await page.locator('table tbody tr').first().locator('input[type="number"]').first().fill('100');
    
    responsePromise = page.waitForResponse(res => res.request().method() === 'POST');
    await page.locator('button[type="submit"]').click();
    await responsePromise;
    await page.goto('/order');
  });
});
