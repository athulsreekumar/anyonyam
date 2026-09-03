# End-to-end tests

Playwright, run with `npm run e2e` (headed debugger: `npm run e2e:ui`).

## What these actually test

There is no live backend + MySQL instance available in the environment these
were authored in, so every spec intercepts the API calls it needs with
`page.route()` instead of hitting a real server (see `e2e/helpers.js`). That
means these tests verify:

- routing and route guards (redirect to `/Login` when unauthenticated,
  redirect a non-admin away from `/Admin`)
- the frontend's request shape (what it sends, when)
- rendering given a known API response

They do **not** exercise the real database, the real auth/OTP flow end to
end, or catch a backend regression. Treat them as a browser-level
complement to the component tests in `src/**/*.test.jsx`, not a replacement
for a real staging-environment smoke test.

## Wiring this to the real backend (recommended next step for CI)

To get a true end-to-end run:

1. Stand up the backend (`anyonyamBE`) against a disposable MySQL instance -
   a `docker-compose.yml` with a `mysql:8` service and the schema from
   `backend/docs/MIGRATIONS.md` applied is the natural shape for this.
2. Seed a handful of known test members (phone numbers, one admin).
3. Point `REACT_APP_BASE_URL` in `playwright.config.js`'s `webServer.env`
   at that backend instead of `http://localhost:8800` with nothing behind
   it.
4. Delete the `page.route()` mocks in specs you want to run "for real" -
   `public-site.spec.js` doesn't need the backend at all and already runs
   as a true e2e test; `login-flow.spec.js` and `admin-flow.spec.js` would
   need an OTP value your test setup can predict (e.g. a backend seam that
   logs the OTP in a test environment instead of sending an SMS).

## Local browser note

`playwright.config.js` reads `PLAYWRIGHT_CHROMIUM_PATH` to point at a
pre-installed Chromium binary rather than the one `npx playwright install`
normally downloads (that's how this suite was authored/run - see the repo's
sandbox notes). On a normal machine, run `npx playwright install chromium`
once and leave that env var unset.
