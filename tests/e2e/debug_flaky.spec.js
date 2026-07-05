const { test, expect } = require('@playwright/test');

test('Order Creation Flow Flaky Check', async ({ page }) => {
    test.setTimeout(900000);
    
    const unexpectedDialogs = [];
    page.on('dialog', async dialog => {
      const msg = dialog.message();
      console.log(`[DIALOG] ${msg}`);
      unexpectedDialogs.push(msg);
      await dialog.accept();
    });

    for (let i = 0; i < 5; i++) {
        console.log(`Run ${i}`);
        const uniqueId = Date.now().toString(36);
        const customerCode = 'CUST-E2E-' + uniqueId;
        const trayDesignProduct = 'SMK-227';
        
        await page.goto('http://localhost:3000/master/customers');
        await page.click('a[href="/master/customers/new"]');
        await page.waitForURL(/.*\/master\/customers\/new/);
        
        await page.fill('input[name="customer_code"]', customerCode);
        await page.fill('input[name="delivery_name"]', 'Delivery E2E');
        await page.fill('input[name="customer_name_jp"]', 'Customer Name JP E2E');
        
        await page.locator('button[type="submit"]').click();
        const customerSearchInput = page.getByPlaceholder('Tìm mã hoặc tên khách hàng...').first();
        await customerSearchInput.waitFor({ state: 'visible', timeout: 30000 });
        await customerSearchInput.fill(customerCode);
        await customerSearchInput.press('Enter');
        await page.getByText(customerCode).first().waitFor({ state: 'visible', timeout: 15000 });
        
        // 2. Tray Design Order
        await page.goto('http://localhost:3000/order/new');
        await page.selectOption('select[name="order_type"]', { value: 'design_tray' });
        const trayDesignSlip = 'E2E-D1-' + uniqueId;
        await page.fill('input[name="slip_no"]', trayDesignSlip);
        
        const custInput = page.getByPlaceholder('Gõ mã hoặc tên khách...').first();
        await custInput.click();
        await custInput.fill(customerCode);
        await page.getByRole('list').getByText(customerCode).first().waitFor({ state: 'visible', timeout: 15000 });
        await page.getByRole('list').getByText(customerCode).first().click();

        await page.getByRole('button', { name: 'Thêm Dòng' }).click();
        
        const pnInput = page.locator('tbody tr').last().locator('td').nth(2).locator('input[type="text"]').first();
        await pnInput.click();
        await pnInput.fill(trayDesignProduct);
        await page.getByRole('list').getByText(trayDesignProduct).first().waitFor({ state: 'visible', timeout: 5000 });
        await page.getByRole('list').getByText(trayDesignProduct).first().click();
        await page.locator('tbody tr').last().locator('input[type="number"]').first().fill('100');
        
        await page.locator('button[type="submit"]').last().click();
        
        const search1 = page.getByPlaceholder('Tìm Lot No, Mã SP...').first();
        await search1.waitFor({ state: 'visible', timeout: 30000 });
        await search1.fill(trayDesignSlip);
        await search1.press('Enter');
        try {
            await page.getByText(trayDesignSlip).first().waitFor({ state: 'visible', timeout: 5000 });
        } catch (e) {
            console.log("FAILED ON RUN", i);
            console.log("Dialogs were:", unexpectedDialogs);
            break;
        }
    }
});
