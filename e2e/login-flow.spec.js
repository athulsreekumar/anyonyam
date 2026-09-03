const { test, expect } = require('@playwright/test');
const { apiUrl } = require('./helpers');

test.describe('Login flow (backend mocked)', () => {
  test('phone -> OTP -> logged in and redirected to profile', async ({ page }) => {
    await page.route(apiUrl('/login'), (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'OTP sent' }) })
    );
    await page.route(apiUrl('/auth'), (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          token: 'e2e-token',
          role: 'user',
          memberNo: 103,
          name: 'Test Member',
        }),
      })
    );
    // The Profile page's own data fetch - not under test here.
    await page.route(apiUrl('/profile*'), (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [], isAdmin: false, userMemberNo: 103 }),
      })
    );

    await page.goto('/Login');
    await page.getByPlaceholder(/phone number/i).fill('9876543210');
    await page.getByRole('button', { name: /get otp/i }).click();

    await expect(page.getByRole('button', { name: /submit otp/i })).toBeVisible();

    for (let i = 1; i <= 6; i += 1) {
      await page.getByLabel(`Please enter OTP character ${i}`).fill(String(i));
    }
    await page.getByRole('button', { name: /submit otp/i }).click();

    await expect(page).toHaveURL(/\/Profile\/103/);
  });

  test('shows an inline error for a phone number the backend does not recognize', async ({ page }) => {
    await page.route(apiUrl('/login'), (route) =>
      route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'Not found' }) })
    );

    await page.goto('/Login');
    await page.getByPlaceholder(/phone number/i).fill('9999999999');
    await page.getByRole('button', { name: /get otp/i }).click();

    await expect(page.getByText(/does not exist/i)).toBeVisible();
  });

  test('rejects an obviously invalid phone number without calling the backend', async ({ page }) => {
    let called = false;
    await page.route(apiUrl('/login'), (route) => {
      called = true;
      route.fulfill({ status: 200, body: '{}' });
    });

    await page.goto('/Login');
    await page.getByPlaceholder(/phone number/i).fill('123');
    await page.getByRole('button', { name: /get otp/i }).click();

    await expect(page.getByText(/valid 10-digit phone number/i)).toBeVisible();
    expect(called).toBe(false);
  });
});
