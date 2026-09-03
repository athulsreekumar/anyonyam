const { test, expect } = require('@playwright/test');

test.describe('Public site', () => {
  test('home page loads with nav and intro content', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await expect(page.locator('.intro')).toBeVisible();
  });

  test('navigating to About Us shows the History page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'About Us' }).click();
    await expect(page).toHaveURL(/\/About\/History/);
    await expect(page.getByText('Our Story')).toBeVisible();
    await expect(page.getByText(/formed in 1998/)).toBeVisible();
  });

  test('Gallery loads photos from the generated manifest and switches categories', async ({ page }) => {
    await page.goto('/Gallery');
    await expect(page.locator('.gallery .heading')).toHaveText('Gallery');

    const images = page.locator('.imgContainer img');
    await expect(images.first()).toBeVisible();
    const varshikamCount = await images.count();
    expect(varshikamCount).toBeGreaterThan(0);

    await page.getByText('Football Mela').click();
    await expect(images.first()).toBeVisible();
  });

  test('an unauthenticated visitor is redirected to Login from a protected route', async ({ page }) => {
    await page.goto('/Admin');
    await expect(page).toHaveURL(/\/Login/);
    await expect(page.getByRole('heading', { name: 'Hello!' })).toBeVisible();
  });
});
