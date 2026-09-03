// Single source of truth for persisted auth state. Previously the app wrote
// four independent localStorage keys (user-auth-token, loggedIn, memberNo,
// isAdmin) from different components at different times, which is how the
// nav bar's "Admin" link could show a stale value from a previous session.
const STORAGE_KEY = "anyonyam.auth";

const EMPTY = { token: null, role: null, memberNo: null, name: null };

export function readAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

export function writeAuth(auth) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
  // Clean up the legacy keys too, for anyone with an old session cached.
  ["user-auth-token", "loggedIn", "memberNo", "isAdmin"].forEach((key) =>
    localStorage.removeItem(key)
  );
}
