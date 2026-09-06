# Anyonyam — frontend (rebuild)

React (Vite) + TypeScript frontend for the Anyonyam membership management
app, rebuilt from scratch against the existing
[`anyonyamBE`](../anyonyamBE) API. Replaces `anyonyam-1` (CRA/JS) — see
that repo's README for why: unmaintained build tooling, a routing
security advisory, and no real design system.

**Status: Phase 2 of 3.** Design system, public marketing pages (Home,
History, Today, Contact, Gallery), member login (phone/OTP), and
profile/family-member management are built. Admin dashboard and search
(Phase 3) are not — see Roadmap below.

## Design direction

"Warm heritage, modernized" — the org's cultural warmth (deep maroon/gold/
cream) executed with restraint: a serif display face (Fraunces) paired with
Inter for body text, real event photography instead of illustration,
generous whitespace. Tokens live in `src/styles/tokens.css` as a Tailwind
v4 `@theme` block — every color/font/radius/shadow used anywhere in the app
is defined once there.

## Architecture

```
src/
  App.tsx                 route table
  main.tsx                entrypoint - Router + AuthProvider + ToastProvider + App
  auth/
    AuthContext.tsx           auth state (token/role/memberNo/name), one localStorage key
    RequireAuth.tsx            route guard - any logged-in member
    RequireAdmin.tsx            route guard - admin only
  styles/
    tokens.css             design tokens (Tailwind v4 @theme block)
    globals.css             Tailwind import + base layer + reduced-motion
  lib/
    apiClient.ts             one axios instance: attaches the auth token, handles 401
    authStorage.ts            single localStorage key for auth state
    env.ts                     typed, fail-fast import.meta.env access
    cn.ts                       clsx + tailwind-merge helper
  validators/
    memberSchemas.ts            zod schemas for the edit-profile and add-family-member forms
  content/                     site copy as data (org info, vision/mission,
                                history, today, contact, nav, gallery) -
                                not component code, so it's editable without
                                touching JSX. See content/site.ts for the
                                upcoming-event banner if scheduling a new one.
  components/
    atoms/         Button, Input, Label, Heading, Text, Badge, Avatar,
                    Spinner, Logo, IconButton
    molecules/       FormField, Card, NavLink, Toast, Modal, ConfirmDialog,
                      SectionHeading, OtpInput, MemberCard
    organisms/         Topbar, MobileNav, Footer, HeroSection,
                        VisionMissionSection, UpcomingEventBanner,
                        ContactPanel, GalleryGrid, GalleryLightbox,
                        ProfileDetailModal, AddFamilyMemberModal
    templates/            PublicLayout (Topbar + <Outlet/> + Footer)
  pages/                      route-level compositions, incl. LoginPage,
                                ProfilePage, LogoutPage
  test/
    setup.ts                     Vitest + MSW bootstrap
    renderWithProviders.tsx       Auth + Toast + Router test wrapper
    fixtures/                      shared sample data (e.g. member records)
    mocks/                          MSW handlers for the endpoints in use
```

Every atom/molecule/organism/page/hook has a colocated `*.test.tsx`.

## Setup

```
cp .env.example .env.local
npm install
npm run dev
```

### Environment variables

`VITE_API_BASE_URL` — the backend's base URL (e.g. `http://localhost:8800`
locally). Vite only exposes vars prefixed `VITE_` to the browser bundle —
never put a secret in one.

**If you point this at a local backend**, its `CORS_ORIGINS` must include
this app's dev origin (`http://localhost:5173` by default) or every API
call will fail with a CORS error in the browser console, not a clear error
in the UI — see `anyonyamBE/backend/.env`.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Dev server (Vite) |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with a coverage report |
| `npm run typecheck` | `tsc -b`, no emit |
| `npm run lint` | oxlint (includes jsx-a11y rules) |
| `npm run format` | Prettier, writes in place |

## Testing

Vitest + React Testing Library + `@testing-library/user-event` + `msw`
(handlers in `src/test/mocks/handlers.ts`, override per-test with
`server.use(...)` for error-path coverage). Assertions favor accessible
queries (role/label/text) over test IDs or implementation details.

One known rough edge: axios + a `FormData`/`File` body doesn't survive a
real round trip through jsdom + MSW (jsdom's `XMLHttpRequest` never fires
load/error for that body type). The image-upload test spies on
`api.post` instead of pushing real bytes through the stack — see the note
in `ProfileDetailModal.test.tsx`.

## Known issues surfaced by this phase (backend/infra, not this app)

- **Aiven MySQL clock skew**: the DB host's clock reads ~5.5 hours behind
  real UTC (matches the IST offset), which makes OTP expiry checks in
  `backend/routes/login.js` fail even on a freshly-generated code. Not
  fixable from the frontend - worth an Aiven support ticket.
- **DATE columns shift by one day on read**: inserting `DOB = '1990-01-01'`
  comes back from `GET /profile` as `1989-12-31T18:30:00.000Z` - the same
  ~5.5 hour (IST) offset as the clock skew above, so likely the same root
  cause (a DB/driver timezone mismatch, not a bug in this frontend). Affects
  every stored DATE value, not just DOB.

## Roadmap

- **Phase 3**: `SearchPage`, `AdminPage` (metrics, a lightweight chart,
  pending-subscription table, record-payment + create-member forms),
  Excel export.
- A proper Playwright e2e suite once there's a stable backend to run it
  against (see known issues above).
