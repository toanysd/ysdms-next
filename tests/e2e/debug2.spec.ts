import { test, expect } from '@playwright/test';

test.describe('Order Creation Flow', () => {
  test('should create customer and orders', async ({ page }) => {
    test.setTimeout(300000);
    const uniqueId = Date.now().toString(36);
    const customerCode = 'CUST-E2E-' + uniqueId;
    const ts = uniqueId;
    const trayDesignProduct = 'TRAY-DESIGN-' + ts;
    const trayMassProduct = 'TRAY-MASS-' + ts;
    const moldDesignProduct = 'MOLD-DESIGN-' + ts;

    page.on('dialog', async dialog => {
      console.log('DIALOG OPENED:', dialog.message());
      const msg = dialog.message().toLowerCase();
      if (msg.includes('thành công') || msg.includes('success')) {
        await dialog.accept();
        return;
      }
      throw new Error(`Unexpected dialog: ${dialog.message()}`);
    });
    
    // 1. Customer Contact
    await page.goto('/master/customers');
    await page.click('a[href="/master/customers/new"]');
    await expect(page).toHaveURL(/.*\/master\/customers\/new/, { timeout: 30000 });
    
    await page.fill('input[name="customer_code"]', customerCode);
    await page.fill('input[name="delivery_name"]', 'Delivery E2E');
    await page.fill('input[name="customer_name_jp"]', 'Customer Name JP E2E');
    
    await Promise.all([
      page.waitForResponse(res => (res.request().method() === 'POST' || res.request().method() === 'PUT') && res.url().includes('/master/customers')),
      page.locator('button[type="submit"]').click()
    ]);

    // Go to list page explicitly since there might be no natural redirect
    await page.goto('/master/customers');
    await page.fill('input[placeholder="Tìm mã hoặc tên khách hàng..."]', customerCode);
    await expect(page.getByText(customerCode).first()).toBeVisible();

    // 1.5 Create Products for Orders
    const productsToCreate = [
      { code: trayDesignProduct, name: 'Tray Design' },
      { code: trayMassProduct, name: 'Tray Mass' },
      { code: moldDesignProduct, name: 'Mold Design' }
    ];
    for (const p of productsToCreate) {
      await page.goto('/master/product/new');
      await page.fill('input[name="code"]', p.code);
      await page.fill('input[name="name"]', p.name);
      
      const numberInputs = await page.locator('input[type="number"]').all();
      for (const input of numberInputs) {
        await input.fill('0');
      }

      await Promise.all([
        page.waitForResponse(res => res.request().method() === 'POST' && res.url().includes('/master/product')),
        page.locator('button[type="submit"]').click()
      ]);
      await page.waitForTimeout(1000);
    }

    // 2. Tray Design Order
    await page.goto('/order');
    await page.click('a[href="/order/new"]');
    await expect(page).toHaveURL(/.*\/order\/new/, { timeout: 30000 });

    await page.selectOption('select[name="order_type"]', { label: 'Design Tray (Thiết kế Khay)' });
    const trayDesignSlip = 'E2E-D1-' + uniqueId;
    await page.fill('input[name="slip_no"]', trayDesignSlip);
    
    const custInput = page.locator('input[placeholder="Gõ mã hoặc tên khách..."]');
    await custInput.fill('');
    await custInput.pressSequentially(customerCode, { delay: 100 });
    await expect(page.locator('ul').getByText(customerCode).first()).toBeVisible();
    await page.locator('ul').getByText(customerCode).first().click();

    await page.click('button:has-text("Thêm Dòng")');
    
    const pnInput = page.locator('input[placeholder*="P/N"]');
    await pnInput.first().fill('');
    await pnInput.first().pressSequentially(trayDesignProduct, { delay: 100 });
    await expect(page.locator('ul').getByText(trayDesignProduct).first()).toBeVisible();
    await page.locator('ul').getByText(trayDesignProduct).first().click();
    await page.locator('table tbody tr').first().locator('input[type="number"]').first().fill('100');
    
    await Promise.all([
      page.waitForResponse(res => res.request().method() === 'POST' && res.url().includes('/order')),
      page.locator('button[type="submit"]').click()
    ]);
    
    // Check if the application naturally redirects to /order
    await expect(page).toHaveURL(/.*\/order(?:\?.*)?$/, { timeout: 10000 });
    await expect(page.getByText(trayDesignSlip).first()).toBeVisible();

    // 3. Tray Production Order
    await page.goto('/order/new');
    await expect(page).toHaveURL(/.*\/order\/new/, { timeout: 30000 });

    await page.selectOption('select[name="order_type"]', { label: 'Molding (Đúc khuôn Mass)' });
    const trayMassSlip = 'E2E-M1-' + uniqueId;
    await page.fill('input[name="slip_no"]', trayMassSlip);
    
    await custInput.fill('');
    await custInput.pressSequentially(customerCode, { delay: 100 });
    await expect(page.locator('ul').getByText(customerCode).first()).toBeVisible();
    await page.locator('ul').getByText(customerCode).first().click();

    await page.click('button:has-text("Thêm Dòng")');
    
    await pnInput.first().fill('');
    await pnInput.first().pressSequentially(trayMassProduct, { delay: 100 });
    await expect(page.locator('ul').getByText(trayMassProduct).first()).toBeVisible();
    await page.locator('ul').getByText(trayMassProduct).first().click();
    await page.locator('table tbody tr').first().locator('input[type="number"]').first().fill('100');
    
    await Promise.all([
      page.waitForResponse(res => res.request().method() === 'POST' && res.url().includes('/order')),
      page.locator('button[type="submit"]').click()
    ]);
    
    // Check if the application naturally redirects to /order
    await expect(page).toHaveURL(/.*\/order(?:\?.*)?$/, { timeout: 10000 });
    await expect(page.getByText(trayMassSlip).first()).toBeVisible();

    // 4. Mold Order
    await page.click('a[href="/order/new"]');
    await expect(page).toHaveURL(/.*\/order\/new/, { timeout: 30000 });

    await page.selectOption('select[name="order_type"]', { label: 'Design Mold (Thiết kế Khuôn)' });
    const moldDesignSlip = 'E2E-DM1-' + uniqueId;
    await page.fill('input[name="slip_no"]', moldDesignSlip);
    
    await custInput.fill('');
    await custInput.pressSequentially(customerCode, { delay: 100 });
    await expect(page.locator('ul').getByText(customerCode).first()).toBeVisible();
    await page.locator('ul').getByText(customerCode).first().click();

    await page.click('button:has-text("Thêm Dòng")');
    
    await pnInput.first().fill('');
    await pnInput.first().pressSequentially(moldDesignProduct, { delay: 100 });
    await expect(page.locator('ul').getByText(moldDesignProduct).first()).toBeVisible();
    await page.locator('ul').getByText(moldDesignProduct).first().click();
    await page.locator('table tbody tr').first().locator('input[type="number"]').first().fill('100');
    
    await Promise.all([
      page.waitForResponse(res => res.request().method() === 'POST' && res.url().includes('/order')),
      page.locator('button[type="submit"]').click()
    ]);
    
    // Check if the application naturally redirects to /order
    await expect(page).toHaveURL(/.*\/order(?:\?.*)?$/, { timeout: 10000 });
    await expect(page.getByText(moldDesignSlip).first()).toBeVisible();
  });
});
