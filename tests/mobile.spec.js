const { test, expect, devices } = require('@playwright/test');

const VIEWPORTS = {
  'iPhone SE': { width: 375, height: 667 },
  'iPhone 14': { width: 390, height: 844 },
  'iPhone 17': { width: 393, height: 852 },
  'Android small': { width: 360, height: 740 },
  'Android large': { width: 414, height: 896 },
};

const BASE_URL = process.env.TEST_URL || 'http://localhost:8847';

for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(`Mobile — ${name} (${viewport.width}x${viewport.height})`, () => {
    test.use({
      viewport,
      isMobile: true,
      hasTouch: true,
    });

    test('no horizontal overflow', async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });

    test('all 4 tabs are visible and tappable', async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      const tabs = ['home', 'experience', 'projects', 'contact'];
      for (const tabId of tabs) {
        const tab = page.locator(`.tab[data-tab="${tabId}"]`);
        await expect(tab).toBeVisible();
        const box = await tab.boundingBox();
        expect(box.height).toBeGreaterThanOrEqual(40);
      }
    });

    test('tab switching works via tap', async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      const tabs = ['projects', 'experience', 'contact', 'home'];
      for (const tabId of tabs) {
        await page.locator(`.tab[data-tab="${tabId}"]`).click();
        await expect(page.locator(`#tab-${tabId}`)).toHaveClass(/active/);
      }
    });

    test('window fills most of viewport width on mobile', async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      const windowFrame = page.locator('.window-frame');
      const box = await windowFrame.boundingBox();
      // Terminal should be close to full width but with small margins (floating style)
      expect(box.width).toBeGreaterThanOrEqual(viewport.width - 20);
    });

    test('project rows are tappable and expand', async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.locator('.tab[data-tab="projects"]').click();
      await page.waitForTimeout(300);

      const firstRow = page.locator('.tui-row').first();
      await expect(firstRow).toBeVisible();
      const box = await firstRow.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(36);

      await firstRow.click();
      const detail = page.locator('.tui-detail.visible').first();
      await expect(detail).toBeVisible();
    });

    test('experience rows are tappable and expand', async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.locator('.tab[data-tab="experience"]').click();
      await page.waitForTimeout(300);

      const firstRow = page.locator('.gl-row').first();
      await expect(firstRow).toBeVisible();
      const box = await firstRow.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(36);

      await firstRow.click();
      const detail = page.locator('.gl-detail.visible').first();
      await expect(detail).toBeVisible();
    });

    test('contact links are visible', async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.locator('.tab[data-tab="contact"]').click();
      await page.waitForTimeout(300);

      await expect(page.locator('.link-linkedin')).toBeVisible();
      await expect(page.locator('a[href*="github.com"]').last()).toBeVisible();
      await expect(page.locator('a[href*="resume.pdf"]').last()).toBeVisible();
    });

    test('git hash is hidden on narrow screens', async ({ page }) => {
      test.skip(viewport.width > 600, 'Only applies to mobile');
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.locator('.tab[data-tab="experience"]').click();
      await page.waitForTimeout(300);

      const hash = page.locator('.gl-hash').first();
      await expect(hash).toBeHidden();
    });

    test('terminal input does not auto-focus on tab switch (touch)', async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.locator('.tab[data-tab="projects"]').click();
      await page.waitForTimeout(200);

      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.classList?.contains('input-text') || false;
      });
      expect(focused).toBe(false);
    });
  });
}
