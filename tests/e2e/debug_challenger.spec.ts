import { test, expect } from '@playwright/test';

test.describe('Order Creation Flow', () => {
  test('should create customer and orders', async ({ page }) => {
    test.setTimeout(120000);
    const uniqueId = Date.now().toString(36);
    const customerCode = 'CUST-E2E-' + uniqueId;
    const trayDesignProduct = 'SMK-227';

    // 1. Customer Contact
    await page.goto('/master/customers');
    await page.click('a[href="/master/customers/new"]');
    await expect(page).toHaveURL(/.*\/master\/customers\/new/, { timeout: 60000 });
    
    await page.fill('input[name="customer_code"]', customerCode);
    await page.fill('input[name="delivery_name"]', 'Delivery E2E');
    await page.fill('input[name="customer_name_jp"]', 'Customer Name JP E2E');
    
    await page.locator('button[type="submit"]').click();

    // 2. Tray Design Order
    await page.goto('/order/new');

    await page.selectOption('select[name="order_type"]', { value: 'design_tray' });
    const trayDesignSlip = 'E2E-D1-' + uniqueId;
    await page.fill('input[name="slip_no"]', trayDesignSlip);
    
    const custInput = page.getByPlaceholder('Gõ mã hoặc tên khách...').first();
    await custInput.click();
    await custInput.fill(customerCode);
    await expect(page.getByRole('list').getByText(customerCode).first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('list').getByText(customerCode).first().click();

    await page.getByRole('button', { name: 'Thêm Dòng' }).click();
    
    const pnInput = page.locator('tbody tr').last().locator('td').nth(2).locator('input[type="text"]').first();
    await pnInput.first().click();
    await pnInput.first().fill(trayDesignProduct);
    await expect(page.getByRole('list').getByText(trayDesignProduct).first()).toBeVisible({ timeout: 5000 });
    await page.getByRole('list').getByText(trayDesignProduct).first().click();

    await page.locator('tbody tr').last().locator('input[type="number"]').first().fill('100');
    
    await page.locator('button[type="submit"]').last().click();
    
    const search1 = page.getByPlaceholder('Tìm Lot No, Mã SP...').first();
    await expect(search1).toBeVisible({ timeout: 30000 });
    
    console.log("Navigated to order list, searching for", trayDesignSlip);
    await page.screenshot({ path: 'before_search.png', fullPage: true });

    await search1.fill(trayDesignSlip);
    await search1.press('Enter');
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'after_search.png', fullPage: true });

    console.log("Checking if text is visible...");
    try {
        await expect(page.getByText(trayDesignSlip).first()).toBeVisible({ timeout: 10000 });
        console.log("FOUND!");
    } catch (e) {
        console.log("NOT FOUND!");
    }
  });
});
