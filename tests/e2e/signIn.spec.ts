import { expect, test } from '@playwright/test';

test('neutral sign-in renders without protected identity', async ({ page }) => {
  await page.goto('#/sign-in');
  await expect(page.getByRole('heading', { name: 'Civora Control' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByText('No self-registration')).toBeVisible();
  await expect(page.locator('body')).not.toContainText('P136');
});

test('password reset keeps account eligibility neutral', async ({ page }) => {
  await page.goto('#/reset-password');
  await page.getByLabel('Email address').fill('unknown@example.invalid');
  await page.getByRole('button', { name: 'Send reset link' }).click();
  await expect(page.getByText('If the address is eligible, reset instructions will be sent.')).toBeVisible();
});
