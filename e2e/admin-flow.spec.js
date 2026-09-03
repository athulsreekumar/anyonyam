const { test, expect } = require('@playwright/test');
const { seedAuth, apiUrl } = require('./helpers');

test.describe('Admin dashboard (backend mocked)', () => {
  test('shows the subscription summary and records a payment', async ({ page }) => {
    await seedAuth(page, { role: 'admin', memberNo: 1, name: 'Admin User' });
    await page.route(apiUrl('/paidSubscription'), (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          paidSubscriptions: [
            { UNIQUEID: 'ANYONYAM103_1', MemberNo: 103, Name: 'Test Member', Mobile: '9876543210', Subscription: 500 },
          ],
          totalMembers: [{ MemberNo: 103 }, { MemberNo: 104 }],
          totalPending: 500,
        }),
      })
    );
    let recordPaymentCalled = false;
    await page.route(apiUrl('/recordPayment*'), (route) => {
      recordPaymentCalled = true;
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'ok' }) });
    });

    await page.goto('/Admin');

    await expect(page.getByText('Test Member')).toBeVisible();
    await page.getByText('Test Member').click();
    await page.getByLabel('Amount').fill('500');
    await page.getByRole('button', { name: /submit/i }).click();

    await expect.poll(() => recordPaymentCalled).toBe(true);
  });

  test('the Admin route redirects a non-admin member to their own profile', async ({ page }) => {
    await seedAuth(page, { role: 'user', memberNo: 7, name: 'Regular Member' });
    await page.route(apiUrl('/profile*'), (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [], isAdmin: false, userMemberNo: 7 }),
      })
    );

    await page.goto('/Admin');

    await expect(page).toHaveURL(/\/Profile\/7/);
  });
});
