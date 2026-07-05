import { test, expect } from '@playwright/test';

test.describe('Order Creation Flow', () => {
  test('should create customer and orders', async ({ page }) => {
    test.setTimeout(900000);
    const uniqueId = Date.now().toString(36);
    const customerCode = 'CUST-E2E-' + uniqueId;
    const ts = uniqueId;
    const trayDesignProduct = 'PROD-TD-' + uniqueId;
    const trayMassProduct = 'PROD-TM-' + uniqueId;
    const moldDesignProduct = 'PROD-MD-' + uniqueId;

    const unexpectedDialogs: string[] = [];

    page.on('dialog', async dialog => {
      const msg = dialog.message().toLowerCase();
      console.log('DIALOG MSG:', msg);
      const isSuccess = /(th\u00E0nh c\u00F4ng|success)/.test(msg) && 
                        !/(unsuccess|not\s+success|fail|error|l\u1ED7i|kh\u00F4ng\s+th\u00E0nh\s+c\u00F4ng)/.test(msg);

      if (isSuccess) {
        await dialog.accept();
        return;
      }
      unexpectedDialogs.push(dialog.message());
      await dialog.accept();
    });
    
    // 1. Customer Contact
    await page.goto('/master/customers');
    await page.click('a[href="/master/customers/new"]');
    
    await page.fill('input[name="customer_code"]', customerCode);
    await page.fill('input[name="delivery_name"]', 'Delivery E2E');
    await page.fill('input[name="customer_name_jp"]', 'Customer Name JP E2E');
    
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(1500);
    
    await expect(async () => {
        await page.goto('/master/customers');
        const customerSearchInput = page.getByPlaceholder('Tìm mã hoặc tên khách hàng...').first();
        await expect(customerSearchInput).toBeVisible({ timeout: 5000 });
        await customerSearchInput.fill(customerCode);
        await customerSearchInput.press('Enter');
        await expect(page.getByText(customerCode).first()).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 30000 });

    // 1.5 Create Products for Orders
    const createProduct = async (productCode: string) => {
        await page.goto('/master/product/new');
        
        // Fill text fields
        const textInputs = ['code', 'name', 'internal_product_name', 'customer_product_name', 'customer_part_number', 'material'];
        for (const field of textInputs) {
            const locators = page.locator(`input[name="${field}"]`);
            const count = await locators.count();
            for (let i = 0; i < count; i++) {
                await locators.nth(i).fill(productCode);
            }
        }
        
        // Fill number fields
        const numberInputs = ['thickness', 'sheet_width', 'length_val', 'width_val', 'p_length', 'p_width', 'length_tol_upper', 'length_tol_lower', 'width_tol_upper', 'width_tol_lower', 'quantity_per_box'];
        for (const field of numberInputs) {
            const locators = page.locator(`input[name="${field}"]`);
            const count = await locators.count();
            for (let i = 0; i < count; i++) {
                await locators.nth(i).fill('1');
            }
        }
        
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(1500);
        
        await expect(async () => {
            await page.goto('/master/product');
            const productSearchInput = page.getByPlaceholder('Tìm mã khay, tên khay...').first();
            await expect(productSearchInput).toBeVisible({ timeout: 5000 });
            await productSearchInput.fill(productCode);
            await productSearchInput.press('Enter');
            await expect(page.getByText(productCode).first()).toBeVisible({ timeout: 5000 });
        }).toPass({ timeout: 30000 });
    };

    await createProduct(trayDesignProduct);
    await createProduct(trayMassProduct);
    await createProduct(moldDesignProduct);

    // 2. Tray Design Order
    await page.goto('/order/new');

    await page.selectOption('select[name="order_type"]', { value: 'design_tray' });
    const trayDesignSlip = 'E2E-D1-' + uniqueId;
    await page.fill('input[name="slip_no"]', trayDesignSlip);
    await page.fill('input[name="order_date"]', '2026-05-31');
    await page.fill('input[name="recipient_name"]', 'Test');
    await page.fill('input[name="handler_name"]', 'Test');
    
    const custInput = page.getByPlaceholder('Gõ mã hoặc tên khách...').first();
    await custInput.click();
    await custInput.fill(customerCode);
    await expect(page.getByRole('list').getByText(customerCode).first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('list').getByText(customerCode).first().click();

    await page.getByRole('button', { name: 'Thêm Dòng' }).click();
    
    const pnInput = page.locator('tbody tr').last().locator('td').nth(2).locator('input[type="text"]').first();
    await pnInput.first().fill('');
    await pnInput.first().click();
    await pnInput.first().fill(trayDesignProduct);
    await expect(page.getByRole('list').getByText(trayDesignProduct).first()).toBeVisible({ timeout: 5000 });
    await page.getByRole('list').getByText(trayDesignProduct).first().click();
    await page.locator('tbody tr').last().locator('input[type="number"]').first().fill('100');
    
    await page.locator('button[type="submit"]').last().click();
    await page.waitForTimeout(2000);
    
    await expect(async () => {
        await page.goto('/order');
        const search1 = page.getByPlaceholder('Tìm Lot No, Mã SP...').first();
        await expect(search1).toBeVisible({ timeout: 5000 });
        await search1.fill(trayDesignSlip);
        await search1.press('Enter');
        await expect(page.getByText(trayDesignSlip).first()).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 30000 });

    // 3. Tray Production Order
    await page.goto('/order/new');

    await page.selectOption('select[name="order_type"]', { value: 'molding' });
    const trayMassSlip = 'E2E-M1-' + uniqueId;
    await page.fill('input[name="slip_no"]', trayMassSlip);
    await page.fill('input[name="order_date"]', '2026-05-31');
    await page.fill('input[name="recipient_name"]', 'Test');
    await page.fill('input[name="handler_name"]', 'Test');
    
    const custInput2 = page.getByPlaceholder('Gõ mã hoặc tên khách...').first();
    await custInput2.click();
    await custInput2.fill(customerCode);
    await expect(page.getByRole('list').getByText(customerCode).first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('list').getByText(customerCode).first().click();

    await page.getByRole('button', { name: 'Thêm Dòng' }).click();
    
    const pnInput2 = page.locator('tbody tr').last().locator('td').nth(2).locator('input[type="text"]').first();
    await pnInput2.fill('');
    await pnInput2.click();
    await pnInput2.fill(trayMassProduct);
    await expect(page.getByRole('list').getByText(trayMassProduct).first()).toBeVisible({ timeout: 5000 });
    await page.getByRole('list').getByText(trayMassProduct).first().click();
    await page.locator('tbody tr').last().locator('input[type="number"]').first().fill('100');
    
    await page.locator('button[type="submit"]').last().click();
    await page.waitForTimeout(2000);
    
    await expect(async () => {
        await page.goto('/order');
        const search2 = page.getByPlaceholder('Tìm Lot No, Mã SP...').first();
        await expect(search2).toBeVisible({ timeout: 5000 });
        await search2.fill(trayMassSlip);
        await search2.press('Enter');
        await expect(page.getByText(trayMassSlip).first()).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 30000 });

    // 4. Mold Order
    await page.goto('/order/new');

    await page.selectOption('select[name="order_type"]', { value: 'design_mold' });
    const moldDesignSlip = 'E2E-DM1-' + uniqueId;
    await page.fill('input[name="slip_no"]', moldDesignSlip);
    await page.fill('input[name="order_date"]', '2026-05-31');
    await page.fill('input[name="recipient_name"]', 'Test');
    await page.fill('input[name="handler_name"]', 'Test');
    
    const custInput3 = page.getByPlaceholder('Gõ mã hoặc tên khách...').first();
    await custInput3.click();
    await custInput3.fill(customerCode);
    await expect(page.getByRole('list').getByText(customerCode).first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('list').getByText(customerCode).first().click();

    await page.getByRole('button', { name: 'Thêm Dòng' }).click();
    
    const pnInput3 = page.locator('tbody tr').last().locator('td').nth(2).locator('input[type="text"]').first();
    await pnInput3.fill('');
    await pnInput3.click();
    await pnInput3.fill(moldDesignProduct);
    await expect(page.getByRole('list').getByText(moldDesignProduct).first()).toBeVisible({ timeout: 5000 });
    await page.getByRole('list').getByText(moldDesignProduct).first().click();
    await page.locator('tbody tr').last().locator('input[type="number"]').first().fill('100');
    
    await page.locator('button[type="submit"]').last().click();
    await page.waitForTimeout(2000);
    
    await expect(async () => {
        await page.goto('/order');
        const search3 = page.getByPlaceholder('Tìm Lot No, Mã SP...').first();
        await expect(search3).toBeVisible({ timeout: 5000 });
        await search3.fill(moldDesignSlip);
        await search3.press('Enter');
        await expect(page.getByText(moldDesignSlip).first()).toBeVisible({ timeout: 5000 });
    }).toPass({ timeout: 30000 });

    expect(unexpectedDialogs).toHaveLength(0);
  });
});
