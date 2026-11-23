import { NextResponse } from "next/server"
import { getImageOverridesMap } from "@/lib/admin-db"

export async function GET() {
  const map = await getImageOverridesMap()
  const overridesByPath: Record<string, string> = {}

  for (const item of Object.values(map)) {
    overridesByPath[item.path] = `/api/media/${item.key}?v=${item.updatedAt}`
  }

  return NextResponse.json(
    { overrides: overridesByPath },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  )
}
