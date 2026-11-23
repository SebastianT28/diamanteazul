import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getAuthenticatedAdmin } from "@/lib/admin-auth"
import {
  getImageOverridesMap,
  isMySqlConfigured,
  restoreOriginalSlotImage,
  saveUploadedSlotImage,
} from "@/lib/admin-db"
import { EDITABLE_IMAGE_SLOTS } from "@/data/site-images-catalog"

export async function GET() {
  const session = await getAuthenticatedAdmin()
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const overrides = await getImageOverridesMap()
  const slots = EDITABLE_IMAGE_SLOTS.map((slot) => {
    const ov = overrides[slot.key]
    return {
      ...slot,
      isOverridden: Boolean(ov),
      updatedAt: ov?.updatedAt ?? null,
      previewUrl: ov
        ? `/api/media/${slot.key}?v=${ov.updatedAt}`
        : slot.path,
    }
  })

  return NextResponse.json(
    {
      slots,
      mysqlConfigured: isMySqlConfigured(),
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
    const slotKey = String(formData.get("slotKey") ?? "").trim()
    const file = formData.get("file")

    if (!slotKey || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Falta indicar la imagen o el archivo a subir." },
        { status: 400 }
      )
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "El archivo seleccionado debe ser una imagen válida." },
        { status: 400 }
      )
    }

    if (file.size > 12 * 1024 * 1024) {
      return NextResponse.json(
        { error: "La imagen no debe superar los 12 MB." },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const meta = await saveUploadedSlotImage(
      slotKey,
      buffer,
      file.type || "image/webp"
    )

    revalidatePath("/", "layout")

    return NextResponse.json({
      ok: true,
      slotKey,
      updatedAt: meta.updatedAt,
      previewUrl: `/api/media/${slotKey}?v=${meta.updatedAt}`,
    })
  } catch (err) {
    console.error("[api/admin/images POST] Error:", err)
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Error al guardar la nueva imagen.",
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
    const slotKey = (searchParams.get("key") ?? "").trim()
    if (!slotKey) {
      return NextResponse.json(
        { error: "Falta la clave de la imagen a restaurar." },
        { status: 400 }
      )
    }

    await restoreOriginalSlotImage(slotKey)
    revalidatePath("/", "layout")

    const slot = EDITABLE_IMAGE_SLOTS.find((s) => s.key === slotKey)
    return NextResponse.json({
      ok: true,
      slotKey,
      previewUrl: slot?.path ?? "",
    })
  } catch (err) {
    console.error("[api/admin/images DELETE] Error:", err)
    return NextResponse.json(
      { error: "Error al restaurar la imagen original." },
      { status: 500 }
    )
  }
}
