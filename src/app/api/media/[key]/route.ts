import { NextRequest, NextResponse } from "next/server"
import { getSlotImageBinary } from "@/lib/admin-db"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ key: string }> }
) {
  const { key } = await context.params
  const result = await getSlotImageBinary(key)

  if (!result) {
    return new NextResponse("Imagen no encontrada", { status: 404 })
  }

  const hasVersion = req.nextUrl.searchParams.has("v")
  return new NextResponse(new Uint8Array(result.buffer), {
    status: 200,
    headers: {
      "Content-Type": result.mimeType || "image/webp",
      "Cache-Control": hasVersion
        ? "public, max-age=31536000, immutable"
        : "no-cache, no-store, must-revalidate",
    },
  })
}
