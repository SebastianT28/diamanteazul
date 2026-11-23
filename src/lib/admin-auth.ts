import crypto from "crypto"
import { cookies } from "next/headers"

export const SESSION_COOKIE_NAME = "da_admin_session"
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12 // 12 hours

// Default initial credentials requested by user:
// usuario: admin
// contraseña: diamanteazul26_$
export const DEFAULT_ADMIN_USERNAME = "admin"
export const DEFAULT_ADMIN_PASSWORD = "diamanteazul26_$"

// Deterministic pre-computed salt for default seed SQL consistency, random salt for all password changes
const DEFAULT_SEED_SALT = "da2026_salt_f9c4e1a8b2d74305"

export function hashPassword(password: string, customSalt?: string): string {
  const salt = customSalt ?? crypto.randomBytes(16).toString("hex")
  const derived = crypto.scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${derived}`
}

export const DEFAULT_ADMIN_PASSWORD_HASH = hashPassword(
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_SEED_SALT
)

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, keyHex] = storedHash.split(":")
    if (!salt || !keyHex) return false
    const keyBuf = Buffer.from(keyHex, "hex")
    const derivedBuf = crypto.scryptSync(password, salt, 64)
    if (keyBuf.length !== derivedBuf.length) return false
    return crypto.timingSafeEqual(keyBuf, derivedBuf)
  } catch {
    return false
  }
}

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.MYSQL_PASSWORD ||
    "da_secret_key_2026_diamante_azul_secure_hmac"
  )
}

export function createSessionToken(username: string): string {
  const exp = Date.now() + SESSION_DURATION_MS
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp }),
    "utf-8"
  ).toString("base64url")
  const sig = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url")
  return `${payload}.${sig}`
}

export function verifySessionToken(
  token: string | undefined
): { username: string } | null {
  if (!token) return null
  const parts = token.split(".")
  if (parts.length !== 2) return null
  const [payload, sig] = parts
  const expectedSig = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url")

  try {
    const sigBuf = Buffer.from(sig)
    const expBuf = Buffer.from(expectedSig)
    if (sigBuf.length !== expBuf.length) return null
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null

    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    ) as { u?: string; exp?: number }
    if (!data.u || !data.exp || Date.now() > data.exp) return null
    return { username: data.u }
  } catch {
    return null
  }
}

export async function getAuthenticatedAdmin(): Promise<{
  username: string
} | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  return verifySessionToken(token)
}

// Brute-force protection (5 failed attempts -> 15 min block per IP)
interface RateLimitEntry {
  failures: number
  firstFailureAt: number
  lockedUntil: number
}

const loginAttempts = new Map<string, RateLimitEntry>()
const MAX_FAILURES = 5
const WINDOW_MS = 15 * 60 * 1000
const LOCKOUT_MS = 15 * 60 * 1000

export function checkLoginRateLimit(ip: string): {
  allowed: boolean
  retryAfterSeconds?: number
} {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry) return { allowed: true }

  if (entry.lockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000),
    }
  }

  if (now - entry.firstFailureAt > WINDOW_MS) {
    loginAttempts.delete(ip)
    return { allowed: true }
  }

  return { allowed: true }
}

export function recordLoginFailure(ip: string): void {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry || now - entry.firstFailureAt > WINDOW_MS) {
    loginAttempts.set(ip, {
      failures: 1,
      firstFailureAt: now,
      lockedUntil: 0,
    })
    return
  }

  entry.failures += 1
  if (entry.failures >= MAX_FAILURES) {
    entry.lockedUntil = now + LOCKOUT_MS
  }
}

export function clearLoginFailures(ip: string): void {
  loginAttempts.delete(ip)
}
