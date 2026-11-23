import { NextRequest, NextResponse } from "next/server"
import {
  checkLoginRateLimit,
  clearLoginFailures,
  createSessionToken,
  getAuthenticatedAdmin,
  hashPassword,
  recordLoginFailure,
  SESSION_COOKIE_NAME,
  verifyPassword,
} from "@/lib/admin-auth"
import {
  getAdminUser,
  isMySqlConfigured,
  updateAdminCredentials,
} from "@/lib/admin-db"

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return req.headers.get("x-real-ip") || "127.0.0.1"
}

export async function GET() {
  const session = await getAuthenticatedAdmin()
  const storedUser = await getAdminUser()
  return NextResponse.json(
    {
      authenticated: Boolean(session),
      username: session?.username ?? null,
      storageMode: storedUser.storageMode,
      mysqlConfigured: isMySqlConfigured(),
    },
    { headers: { "Cache-Control": "no-store" } }
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      action?: "login" | "logout" | "change-credentials"
      username?: string
      password?: string
      currentPassword?: string
      newUsername?: string
      newPassword?: string
    }

    if (body.action === "logout") {
      const res = NextResponse.json({ ok: true })
      res.cookies.set(SESSION_COOKIE_NAME, "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
        sameSite: "lax",
      })
      return res
    }

    if (body.action === "login") {
      const ip = getClientIp(req)
      const rate = checkLoginRateLimit(ip)
      if (!rate.allowed) {
        const mins = Math.ceil((rate.retryAfterSeconds ?? 900) / 60)
        return NextResponse.json(
          {
            error: `Demasiados intentos fallidos. Por seguridad, intenta nuevamente en ${mins} minutos.`,
          },
          { status: 429 }
        )
      }

      const inputUser = (body.username ?? "").trim()
      const inputPass = body.password ?? ""
      const stored = await getAdminUser()

      const isUserMatch = inputUser === stored.username
      const isPassMatch = verifyPassword(inputPass, stored.passwordHash)

      if (!isUserMatch || !isPassMatch) {
        recordLoginFailure(ip)
        return NextResponse.json(
          { error: "Usuario o contraseña incorrectos." },
          { status: 401 }
        )
      }

      clearLoginFailures(ip)
      const token = createSessionToken(stored.username)
      const res = NextResponse.json({
        ok: true,
        username: stored.username,
        storageMode: stored.storageMode,
      })
      res.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 12,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
      return res
    }

    if (body.action === "change-credentials") {
      const session = await getAuthenticatedAdmin()
      if (!session) {
        return NextResponse.json(
          { error: "Sesión no válida o expirada. Inicia sesión nuevamente." },
          { status: 401 }
        )
      }

      const currentPass = body.currentPassword ?? ""
      const nextUser = (body.newUsername ?? "").trim()
      const nextPass = body.newPassword ?? ""

      if (!currentPass) {
        return NextResponse.json(
          { error: "Debes ingresar tu contraseña actual para confirmar." },
          { status: 400 }
        )
      }
      if (nextUser.length < 3) {
        return NextResponse.json(
          { error: "El nombre de usuario debe tener al menos 3 caracteres." },
          { status: 400 }
        )
      }
      if (nextPass.length < 8) {
        return NextResponse.json(
          { error: "La nueva contraseña debe tener al menos 8 caracteres." },
          { status: 400 }
        )
      }

      const stored = await getAdminUser()
      if (!verifyPassword(currentPass, stored.passwordHash)) {
        return NextResponse.json(
          { error: "La contraseña actual ingresada no es correcta." },
          { status: 403 }
        )
      }

      const newHash = hashPassword(nextPass)
      const mode = await updateAdminCredentials(nextUser, newHash)
      const newToken = createSessionToken(nextUser)

      const res = NextResponse.json({
        ok: true,
        username: nextUser,
        storageMode: mode,
        message: "Usuario y contraseña actualizados correctamente.",
      })
      res.cookies.set(SESSION_COOKIE_NAME, newToken, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 12,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
      return res
    }

    return NextResponse.json({ error: "Acción no válida." }, { status: 400 })
  } catch (err) {
    console.error("[api/admin/auth] Error:", err)
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    )
  }
}
