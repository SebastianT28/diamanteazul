import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getAuthenticatedAdmin } from "@/lib/admin-auth"
import {
  deleteCatalogProduct,
  getEffectiveCatalogPackages,
  restoreBaseCatalogProduct,
  saveCatalogProduct,
  type AdminProductFormInput,
} from "@/lib/admin-db"
import { PACKAGES_DATA, type ProductCategorySlug } from "@/data/packages"

export async function GET() {
  const session = await getAuthenticatedAdmin()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { products, deletedSlugs, customSlugs, modifiedSlugs } =
    await getEffectiveCatalogPackages()

  const deletedBaseProducts = PACKAGES_DATA.filter((p) =>
    deletedSlugs.includes(p.slug)
  )

  return NextResponse.json(
    {
      products,
      deletedBaseProducts,
      customSlugs,
      modifiedSlugs,
    },
    { headers: { "Cache-Control": "no-store" } }
  )
}

export async function POST(req: NextRequest) {
  const session = await getAuthenticatedAdmin()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const title = String(formData.get("title") ?? "").trim()
    const slug = String(formData.get("slug") ?? "").trim()
    const category = String(
      formData.get("category") ?? "castillos-toboganes"
    ) as ProductCategorySlug
    const collectionName = String(
      formData.get("collectionName") ?? "Línea Dreamy Pastel"
    ).trim()
    const price = String(formData.get("price") ?? "").trim()
    const dimensions = String(formData.get("dimensions") ?? "").trim()
    const cardDimensionTag = String(
      formData.get("cardDimensionTag") ?? ""
    ).trim()
    const rentalDurationTag = String(
      formData.get("rentalDurationTag") ?? "5 hrs"
    ).trim()
    const subtitle = String(formData.get("subtitle") ?? "").trim()
    const description = String(formData.get("description") ?? "").trim()
    const ages = String(formData.get("ages") ?? "Todas las edades").trim()
    const extraHour = String(formData.get("extraHour") ?? "").trim()
    const isNew = String(formData.get("isNew") ?? "") === "true"
    const bulletsText = String(formData.get("bulletsText") ?? "").trim()
    const imagePath = String(formData.get("imagePath") ?? "").trim()
    const file = formData.get("file")

    if (!title) {
      return NextResponse.json(
        { error: "El nombre del producto es obligatorio." },
        { status: 400 }
      )
    }
    if (!price) {
      return NextResponse.json(
        { error: "El precio del producto es obligatorio." },
        { status: 400 }
      )
    }
    if (!dimensions) {
      return NextResponse.json(
        { error: "Las medidas del producto son obligatorias." },
        { status: 400 }
      )
    }

    let imageBuffer: Buffer | null = null
    let imageMime = "image/webp"

    if (file instanceof File && file.size > 0) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "El archivo debe ser una imagen válida (.webp)." },
          { status: 400 }
        )
      }
      if (file.size > 12 * 1024 * 1024) {
        return NextResponse.json(
          { error: "La imagen no debe superar los 12 MB." },
          { status: 400 }
        )
      }
      const ab = await file.arrayBuffer()
      imageBuffer = Buffer.from(ab)
      imageMime = file.type || "image/webp"
    }

    const input: AdminProductFormInput = {
      slug: slug || undefined,
      title,
      category,
      collectionName,
      price,
      dimensions,
      cardDimensionTag: cardDimensionTag || undefined,
      rentalDurationTag,
      subtitle,
      description,
      ages,
      extraHour: extraHour || undefined,
      isNew,
      bulletsText: bulletsText || undefined,
      imagePath: imagePath || undefined,
    }

    const saved = await saveCatalogProduct(input, imageBuffer, imageMime)

    revalidatePath("/", "layout")
    revalidatePath(`/paquetes/${saved.slug}`)

    return NextResponse.json({
      ok: true,
      product: saved,
    })
  } catch (err) {
    console.error("[api/admin/products POST] Error:", err)
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Error al guardar el producto.",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAuthenticatedAdmin()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const slug = (searchParams.get("slug") ?? "").trim()
    const mode = (searchParams.get("mode") ?? "delete").trim()

    if (!slug) {
      return NextResponse.json(
        { error: "Falta indicar el identificador (slug) del producto." },
        { status: 400 }
      )
    }

    if (mode === "restore") {
      await restoreBaseCatalogProduct(slug)
    } else {
      await deleteCatalogProduct(slug)
    }

    revalidatePath("/", "layout")
    revalidatePath(`/paquetes/${slug}`)

    return NextResponse.json({ ok: true, slug, mode })
  } catch (err) {
    console.error("[api/admin/products DELETE] Error:", err)
    return NextResponse.json(
      { error: "No se pudo procesar la acción sobre el producto." },
      { status: 500 }
    )
  }
}
