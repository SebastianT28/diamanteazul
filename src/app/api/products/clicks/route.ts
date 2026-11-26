import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedAdmin } from "@/lib/admin-auth"
import { recordProductClick } from "@/lib/admin-db"

export async function POST(req: NextRequest) {
  try {
    // Do not count clicks made by the administrator while logged into /admin
    const adminSession = await getAuthenticatedAdmin()
    if (adminSession) {
      return NextResponse.json({ ok: true, skipped: "admin-session" })
    }

    const body = (await req.json()) as {
      slug?: string
      type?: "view" | "whatsapp"
      city?: "lima" | "arequipa"
    }

    const slug = (body.slug ?? "").trim()
    if (!slug) {
      return NextResponse.json({ error: "Slug requerido" }, { status: 400 })
    }

    const clickType = body.type === "whatsapp" ? "whatsapp" : "view"
    const city = body.city === "arequipa" ? "arequipa" : "lima"

    await recordProductClick(slug, clickType, city)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[api/products/clicks POST] Error:", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
