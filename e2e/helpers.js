// Shared e2e helpers.
//
// There is no live backend+MySQL instance available to run these against
// (see e2e/README.md), so every spec intercepts the API calls it needs with
// page.route() instead of hitting a real server. That means these tests
// verify the frontend's own behavior - rendering, routing, request shape,
// auth-state handling - not an end-to-end round trip through the real
// database. Wiring these against a real backend (e.g. a docker-compose
// MySQL + the backend repo) is the natural next step for CI; see the README.

const API_BASE = 'http://localhost:8800';

async function seedAuth(page, { token = 'e2e-token', role = 'user', memberNo = 103, name = 'Test Member' } = {}) {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    ['anyonyam.auth', JSON.stringify({ token, role, memberNo, name })]
  );
}

function apiUrl(path) {
  return `${API_BASE}${path}`;
}

module.exports = { API_BASE, seedAuth, apiUrl };
