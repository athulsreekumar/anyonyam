/**
 * Typed access to Vite's import.meta.env. Fails fast at module load if a
 * required variable is missing, instead of surfacing as "undefined" deep
 * inside an API call.
 */
function requireEnv(key: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}. See .env.example.`)
  }
  return value
}

export const env = {
  apiBaseUrl: requireEnv('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
}
