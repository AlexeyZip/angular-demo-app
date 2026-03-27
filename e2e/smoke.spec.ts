import { expect, test } from '@playwright/test';

test.describe('Enterprise Demo smoke', () => {
  test('redirects to dashboard on app open', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('opens protected users page after demo login', async ({ page }) => {
    await page.goto('/login');
    await page.locator('ui-button button').first().click();
    await expect(page).toHaveURL(/\/users$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
