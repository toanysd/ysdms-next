import { test, expect } from '@playwright/test';

test('debug', async ({ page }) => {
    test.setTimeout(900000);
    const uniqueId = Date.now().toString(36);
    const customerCode = 'CUST-DEBUG-' + uniqueId;
    const trayDesignProduct = 'SMK-227';
    
    // 1. Customer Contact
    await page.goto('/master/customers');
    await page.click('a[href="/master/customers/new"]');
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
    await page.getByRole('list').getByText(customerCode).first().click();

    await page.getByRole('button', { name: 'Thêm Dòng' }).click();
    
    const pnInput = page.locator('tbody tr').last().locator('td').nth(2).locator('input[type="text"]').first();
    await pnInput.fill('');
    await pnInput.click();
    await pnInput.fill(trayDesignProduct);
    await page.getByRole('list').getByText(trayDesignProduct).first().click();
    await page.locator('tbody tr').last().locator('input[type="number"]').first().fill('100');
    
    await page.locator('button[type="submit"]').last().click();
    
    // Check if redirect happens
    await page.waitForURL('**/order', { timeout: 15000 });
    
    // Now search
    const search1 = page.getByPlaceholder('Tìm Lot No, Mã SP...').first();
    await search1.fill(trayDesignSlip);
    await search1.press('Enter');
    
    // log page content
    await page.waitForTimeout(3000);
    const text = await page.content();
    console.log("PAGE TEXT AFTER SEARCH:", text.substring(0, 500));
    
    if(await page.getByText(trayDesignSlip).first().isVisible()) {
        console.log("FOUND IT");
    } else {
        console.log("NOT FOUND! Let's check db");
    }
});
