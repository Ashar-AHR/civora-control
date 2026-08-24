import { expect, test } from '@playwright/test';

test('unknown unauthenticated route does not expose the shell', async ({ page }) => {
  await page.goto('#/contracts');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByText('Commercial Management System')).toHaveCount(0);
});

test('sign-in remains usable at 1024 width', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('#/sign-in');
  await expect(page.getByLabel('Email address')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});
