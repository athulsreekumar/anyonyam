# Anyonyam - frontend

React (Create React App) frontend for the Anyonyam membership management
app - a public site plus a members' area (login, profile, admin panel) for
a Tripunithura-based cultural/community organization. Talks to the
[`anyonyamBE`](https://github.com/athulsreekumar/anyonyamBE) API.

## Architecture

```
src/
  app2.jsx                route table + public/authenticated nav switch
  index.js                entrypoint - wraps App in Router/Auth/Toast providers
  api/client.js            one axios instance: attaches the auth token,
                            handles 401 by clearing auth + redirecting to /Login
  auth/
    AuthContext.jsx         single source of truth for auth state
    authStorage.js          the one localStorage key it's persisted under
    RequireAuth.jsx          route guard: any logged-in member
    RequireAdmin.jsx          route guard: admin only
  components/               public site: Topbar, Intro, Event, History,
                            Today, Gallery, Contact, Footer, Login
                            Toast/ToastContext.jsx - replaces window.alert()
  profilecomponent/         authenticated area: Topbar, Profile, Search, admin
  hooks/
    useMenu.js                shared mobile-nav open/close state
    useScrollReveal.js         IntersectionObserver fade-in-on-scroll
  styles/tokens.scss        design tokens: color, type scale, spacing,
                            radius, shadow, motion - see file for the system
scripts/
  generate-gallery-manifest.js  regenerates public/assets/Gallery/manifest.json
                                (run automatically before start/build - see
                                 prestart/prebuild in package.json)
e2e/                       Playwright end-to-end tests (see e2e/README.md)
```

Routes and their guard:

| Path                 | Guard          | Notes |
|-----------------------|----------------|-------|
| `/`, `/About/*`, `/Gallery`, `/Contact` | none | public site |
| `/Login`               | none            | phone + OTP |
| `/Profile/:memberNo`     | any logged-in member | own family only, unless admin |
| `/Admin`                  | admin only     | dashboard, member CRUD, payments |
| `/Search`                   | admin only     | member search |
| `/Logout`                     | -               | clears auth, redirects home |

These are UX guards, not the security boundary - the backend enforces
authorization independently on every request regardless of what the
frontend renders.

## Setup

```
cp .env.example .env.local
npm install
npm start
```

### Environment variables

`REACT_APP_BASE_URL` - the backend's base URL (e.g. `http://localhost:8800`
locally, `https://anyonyam.onrender.com` in production). CRA only exposes
vars prefixed `REACT_APP_` to the browser bundle - never put a secret in one.

## Scripts

| Command            | Does |
|----------------------|------|
| `npm start`            | Dev server (react-scripts) |
| `npm run build`          | Production build to `build/` |
| `npm test`                | Unit/integration tests once (CI mode) |
| `npm run test:watch`       | Tests in watch mode |
| `npm run e2e`                | Playwright e2e against the production build |
| `npm run e2e:ui`               | Same, with Playwright's UI debugger |
| `npm run gallery:manifest`       | Regenerate the Gallery photo manifest by hand |

## Testing

- **Unit/integration**: React Testing Library + Jest (CRA's built-in
  runner). Auth flow, route guards, Login/Search/Admin/Profile against a
  mocked API client, plus smoke tests for the static marketing pages.
- **E2E**: Playwright against the built app. See `e2e/README.md` for
  exactly what is and isn't covered (there's no live backend/database in
  CI yet, so API calls are mocked at the network layer).

## Known limitations / deliberately deferred decisions

Both of these were left alone rather than pushed through unilaterally,
given their blast radius - see the git history on `upgrade-branch` for the
full reasoning:

- **`react-router-dom` has a moderate open-redirect advisory**
  (GHSA-wrjc-x8rr-h8h6). The fix is a v6 -> v7 major upgrade with real
  API/behavior changes across every route in this app. Low practical
  exploitability here (no `<Link to>`/`navigate()` target in this codebase
  is built from unsanitized user input), but worth a deliberate, tested
  migration rather than a drive-by dependency bump.
- **`npm audit` still reports findings** in `react-scripts`' own dev
  toolchain (webpack-dev-server and friends) - none of it ships in the
  production bundle (verify with `npm run build` + inspect `build/`), but
  getting to a clean audit means ejecting or migrating off Create React App
  (e.g. to Vite), which is a build-system change, not a dependency bump.
- The Profile edit form has fields (`PROFESSION`, `EDUCATION`, `Address`,
  `AMMATH`, `GRAMAM`, `VEDAM`, `GOTHRAM`, `BloodGroup`) that predate this
  branch; whether the `members` table actually has those columns was never
  confirmed end-to-end. See `anyonyamBE`'s `backend/docs/MIGRATIONS.md`.
