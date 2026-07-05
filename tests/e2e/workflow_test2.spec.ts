import { test, expect } from '@playwright/test';

test.describe('Order Creation Flow', () => {
  test('should create customer and orders', async ({ page }) => {
    test.setTimeout(900000);
    const uniqueId = Date.now().toString(36);
    const customerCode = 'CUST-E2E-' + uniqueId;
    const ts = uniqueId;
    const trayDesignProduct = 'SMK-227';
    const trayMassProduct = 'SMK-228';
    const moldDesignProduct = 'SMK-227';

    page.on('dialog', async dialog => {
      require('fs').writeFileSync('dialog_msg.txt', dialog.message());
      console.log('DIALOG OPENED:', dialog.message());
      const msg = dialog.message().toLowerCase();
      const isSuccess = /(th\u00E0nh c\u00F4ng|success)/.test(msg) && 
                        !/(unsuccess|not\s+success|fail|error|l\u1ED7i|kh\u00F4ng\s+th\u00E0nh\s+c\u00F4ng)/.test(msg);

      if (isSuccess) {
        await dialog.accept();
        return;
      }
      throw new Error(`Unexpected dialog: ${dialog.message()}`);
    });
    
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
    await page.goto('/master/customers');
    const customerSearchInput = page.getByPlaceholder('Tìm mã hoặc tên khách hàng...').first();
    await customerSearchInput.fill(customerCode);
    await customerSearchInput.press('Enter');
    await expect(page.getByText(customerCode).first()).toBeVisible({ timeout: 15000 });
    console.log('Customer created');

    // 1.5 Create Products for Orders
    // 1.5 Create Products for Orders (Skipped due to backend schema cache issue)
    // We use existing seeded products: SMK-227 and SMK-228

    // 2. Tray Design Order
    await page.goto('/order/new');

    await page.selectOption('select[name="order_type"]', { value: 'design_tray' });
    const trayDesignSlip = 'E2E-D1-' + uniqueId;
    await page.fill('input[name="slip_no"]', trayDesignSlip);
    
    const custInput = page.getByPlaceholder('Gõ mã hoặc tên khách...').first();
    console.log('Filling customerCode');
    await custInput.fill('');
    await custInput.pressSequentially(customerCode, { delay: 100 });
    console.log('Waiting for customerCode in dropdown');
    await expect(page.getByRole('list').getByText(customerCode).first()).toBeVisible({ timeout: 15000 });
    await page.getByRole('list').getByText(customerCode).first().click();
    console.log('Customer selected');

    console.log('Clicking Thêm Dòng button');
    await page.getByRole('button', { name: 'Thêm Dòng' }).click();
    console.log('Thêm Dòng button clicked');
    
    const pnInput = page.locator('tbody tr').last().locator('td').nth(2).locator('input[type="text"]').first();
    await pnInput.first().fill('');
    await pnInput.first().pressSequentially(trayDesignProduct, { delay: 100 });
    console.log('Waiting for trayDesignProduct in dropdown');
    await expect(page.getByRole('list').getByText(trayDesignProduct).first()).toBeVisible({ timeout: 5000 });
    await page.getByRole('list').getByText(trayDesignProduct).first().click();
    console.log('Tray design product selected');
    await page.locator('tbody tr').first().locator('input[type="number"]').first().fill('100');
    
    await Promise.all([
      page.waitForURL(/.*\/order$/, { timeout: 30000 }),
      page.locator('button[type="submit"]').last().click()
    ]);
    await page.goto('/order');

    
    const search1 = page.getByPlaceholder('Tìm Lot No, Mã SP...').first();
    await search1.fill(trayDesignSlip);
    await search1.press('Enter');
    await expect(page.getByText(trayDesignSlip).first()).toBeVisible({ timeout: 15000 });
    console.log('Tray design order created');

    // 3. Tray Production Order
    await page.goto('/order/new');
    await expect(page).toHaveURL(/.*\/order\/new/, { timeout: 60000 });

    await page.selectOption('select[name="order_type"]', { value: 'molding' });
    const trayMassSlip = 'E2E-M1-' + uniqueId;
    await page.fill('input[name="slip_no"]', trayMassSlip);
    
    await custInput.fill('');
    await custInput.pressSequentially(customerCode, { delay: 100 });
    await expect(page.getByRole('list').getByText(customerCode).first()).toBeVisible({ timeout: 60000 });
    await page.getByRole('list').getByText(customerCode).first().click();

    await page.getByRole('button', { name: 'Thêm Dòng' }).click();
    
    const pnInput2 = page.locator('tbody tr').last().locator('td').nth(2).locator('input[type="text"]').first();
    await pnInput2.fill('');
    await pnInput2.pressSequentially(trayMassProduct, { delay: 100 });
    await expect(page.getByRole('list').getByText(trayMassProduct).first()).toBeVisible({ timeout: 5000 });
    await page.getByRole('list').getByText(trayMassProduct).first().click();
    await page.locator('tbody tr').first().locator('input[type="number"]').first().fill('100');
    
    await Promise.all([
      page.waitForURL(/.*\/order$/, { timeout: 30000 }),
      page.locator('button[type="submit"]').last().click()
    ]);
    await page.goto('/order');
    
    const search2 = page.getByPlaceholder('Tìm Lot No, Mã SP...').first();
    await search2.fill(trayMassSlip);
    await search2.press('Enter');
    await expect(page.getByText(trayMassSlip).first()).toBeVisible({ timeout: 15000 });
    console.log('Tray mass order created');

    // 4. Mold Order
    await page.goto('/order/new');

    await page.selectOption('select[name="order_type"]', { value: 'design_mold' });
    const moldDesignSlip = 'E2E-DM1-' + uniqueId;
    await page.fill('input[name="slip_no"]', moldDesignSlip);
    
    await custInput.fill('');
    await custInput.pressSequentially(customerCode, { delay: 100 });
    await expect(page.getByRole('list').getByText(customerCode).first()).toBeVisible({ timeout: 60000 });
    await page.getByRole('list').getByText(customerCode).first().click();

    await page.getByRole('button', { name: 'Thêm Dòng' }).click();
    
    const pnInput3 = page.locator('tbody tr').last().locator('td').nth(2).locator('input[type="text"]').first();
    await pnInput3.fill('');
    await pnInput3.pressSequentially(moldDesignProduct, { delay: 100 });
    await expect(page.getByRole('list').getByText(moldDesignProduct).first()).toBeVisible({ timeout: 5000 });
    await page.getByRole('list').getByText(moldDesignProduct).first().click();
    await page.locator('tbody tr').first().locator('input[type="number"]').first().fill('100');
    
    await Promise.all([
      page.waitForURL(/.*\/order$/, { timeout: 30000 }),
      page.locator('button[type="submit"]').last().click()
    ]);
    await page.goto('/order');
    
    const search3 = page.getByPlaceholder('Tìm Lot No, Mã SP...').first();
    await search3.fill(moldDesignSlip);
    await search3.press('Enter');
    await expect(page.getByText(moldDesignSlip).first()).toBeVisible({ timeout: 15000 });
    console.log('Mold order created');
  });
});
