/**
 * Single source of truth for persisted auth state, one storage key. Wired
 * up fully in Phase 2 (AuthContext, Login, RequireAuth) — the shape is
 * fixed now so apiClient's interceptors have something real to read.
 */
export type Role = 'admin' | 'user'

export interface StoredAuth {
  token: string | null
  role: Role | null
  memberNo: number | null
  name: string | null
}

const STORAGE_KEY = 'anyonyam.auth'

const EMPTY: StoredAuth = { token: null, role: null, memberNo: null, name: null }

export function readAuth(): StoredAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<StoredAuth>
    return { ...EMPTY, ...parsed }
  } catch {
    return EMPTY
  }
}

export function writeAuth(auth: StoredAuth): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEY)
}
