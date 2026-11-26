import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedAdmin } from "@/lib/admin-auth"
import {
  getEffectiveCatalogPackages,
  getProductClicksMap,
  recordProductClick,
  resetProductClicks,
} from "@/lib/admin-db"

export interface AdminProductClickItem {
  slug: string
  title: string
  category: string
  categoryName: string
  collectionName: string
  image: string
  price: string
  viewClicksLima: number
  viewClicksArequipa: number
  totalViewClicks: number
  whatsappClicksLima: number
  whatsappClicksArequipa: number
  totalWhatsappClicks: number
  totalClicks: number
  lastClickedAt: number
}

export async function GET() {
  const session = await getAuthenticatedAdmin()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const [{ products }, clicksMap] = await Promise.all([
    getEffectiveCatalogPackages(),
    getProductClicksMap(),
  ])

  const items: AdminProductClickItem[] = products.map((pkg) => {
    const stat = clicksMap[pkg.slug]
    const vLima = stat?.viewClicksLima ?? 0
    const vAqp = stat?.viewClicksArequipa ?? 0
    const wLima = stat?.whatsappClicksLima ?? 0
    const wAqp = stat?.whatsappClicksArequipa ?? 0
    const totalView = vLima + vAqp
    const totalWa = wLima + wAqp

    return {
      slug: pkg.slug,
      title: pkg.title,
      category: pkg.category,
      categoryName: pkg.categoryName,
      collectionName: pkg.collectionName,
      image: pkg.image,
      price: pkg.price,
      viewClicksLima: vLima,
      viewClicksArequipa: vAqp,
      totalViewClicks: totalView,
      whatsappClicksLima: wLima,
      whatsappClicksArequipa: wAqp,
      totalWhatsappClicks: totalWa,
      totalClicks: totalView,
      lastClickedAt: stat?.lastClickedAt ?? 0,
    }
  })

  items.sort((a, b) => {
    if (b.totalViewClicks !== a.totalViewClicks) {
      return b.totalViewClicks - a.totalViewClicks
    }
    return b.totalWhatsappClicks - a.totalWhatsappClicks
  })

  return NextResponse.json(
    { items },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  )
}

// Public POST on the same route bundle so serverless environments (e.g. Vercel preview before MySQL is connected) share the same instance
export async function POST(req: NextRequest) {
  try {
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
    return NextResponse.json(
      { ok: true, slug, type: clickType, city },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (err) {
    console.error("[api/admin/clicks POST] Error:", err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAuthenticatedAdmin()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const slug = (searchParams.get("slug") ?? "all").trim()
    await resetProductClicks(slug)
    return NextResponse.json({ ok: true, slug })
  } catch (err) {
    console.error("[api/admin/clicks DELETE] Error:", err)
    return NextResponse.json(
      { error: "No se pudieron reiniciar las estadísticas de clics." },
      { status: 500 }
    )
  }
}
