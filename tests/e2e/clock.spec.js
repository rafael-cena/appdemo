const { test, expect } = require('@playwright/test');

test.describe('Clock Auto-Update (US1, SC-001, SC-006)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the initial page load
    await page.waitForLoadState('domcontentloaded');
    // Wait for the clock element to be present
    await page.waitForSelector('#server-time');
  });

  test('displays initial server time from server-side render', async ({ page }) => {
    const timeElement = page.locator('#server-time');
    await expect(timeElement).toBeVisible();

    const initialText = await timeElement.textContent();
    expect(initialText).toMatch(/Hora Atual do Servidor: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
  });

  test('updates time every second (3+ updates within 4 seconds)', async ({ page }) => {
    const timeElement = page.locator('#server-time');

    // Get initial time
    const initialText = await timeElement.textContent();
    const initialTime = initialText.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)[0];

    // Wait for 4 seconds to allow 3+ updates
    await page.waitForTimeout(4000);

    // Get updated time
    const updatedText = await timeElement.textContent();
    const updatedTime = updatedText.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)[0];

    // Verify time has changed (at least seconds should be different)
    expect(updatedTime).not.toBe(initialTime);

    // Parse times to verify progression
    const initialDate = new Date(initialTime.replace(' ', 'T'));
    const updatedDate = new Date(updatedTime.replace(' ', 'T'));
    const diffSeconds = (updatedDate - initialDate) / 1000;

    // Should be approximately 3-4 seconds difference
    expect(diffSeconds).toBeGreaterThanOrEqual(2);
    expect(diffSeconds).toBeLessThanOrEqual(5);
  });

  test('time format remains consistent after updates', async ({ page }) => {
    const timeElement = page.locator('#server-time');

    // Wait for several updates
    await page.waitForTimeout(5000);

    const text = await timeElement.textContent();
    const timeMatch = text.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);

    expect(timeMatch).not.toBeNull();
    expect(timeMatch[0]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  test('page title and header are correctly updated (US2, SC-002, SC-003)', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle('App Demo - Informações do Servidor (alterado pelo Claude Code)');

    // Check h1
    const h1 = page.locator('h1');
    await expect(h1).toHaveText('Informações do Servidor (alterado pelo Claude Code)');
  });

  test('server IP is displayed (FR-006, SC-004)', async ({ page }) => {
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('Endereço IP do Servidor:');
    // IP should contain numbers and dots (IPv4 format)
    expect(bodyText).toMatch(/Endereço IP do Servidor: \d+\.\d+\.\d+\.\d+/);
  });

  test('fallback: initial time visible even if JS would fail (FR-007)', async ({ page }) => {
    // The initial time is rendered server-side, so it should be visible
    // before any JavaScript executes
    const timeElement = page.locator('#server-time');
    await expect(timeElement).toBeVisible();

    const initialText = await timeElement.textContent();
    expect(initialText).toMatch(/Hora Atual do Servidor: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
  });
});

test.describe('API Endpoint /api/time (FR-003, Contract)', () => {
  test('returns valid JSON with time and source', async ({ request }) => {
    const response = await request.get('/api/time', {
      headers: { 'Accept': 'application/json' }
    });

    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('application/json');

    const data = await response.json();
    expect(data).toHaveProperty('time');
    expect(data).toHaveProperty('source');
    expect(data.source).toBe('server');
    expect(data.time).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  test('includes cache control headers', async ({ request }) => {
    const response = await request.get('/api/time', {
      headers: { 'Accept': 'application/json' }
    });

    const headers = response.headers();
    expect(headers['cache-control']).toContain('no-cache');
    expect(headers['cache-control']).toContain('no-store');
    expect(headers['cache-control']).toContain('must-revalidate');
    expect(headers['pragma']).toBe('no-cache');
    expect(headers['expires']).toBe('0');
  });
});