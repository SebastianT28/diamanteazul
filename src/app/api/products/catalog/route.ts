import { NextResponse } from "next/server"
import { getEffectiveCatalogPackages } from "@/lib/admin-db"

export async function GET() {
  const { products, deletedSlugs, customSlugs, modifiedSlugs } =
    await getEffectiveCatalogPackages()

  return NextResponse.json(
    {
      products,
      hasChanges:
        deletedSlugs.length > 0 ||
        customSlugs.length > 0 ||
        modifiedSlugs.length > 0,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  )
}
