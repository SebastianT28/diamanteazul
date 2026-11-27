import { NextRequest, NextResponse } from "next/server"
import type { CitySlug } from "@/lib/city-context"

const LIMA_COORDS = { lat: -12.0464, lon: -77.0428 }
const AREQUIPA_COORDS = { lat: -16.409, lon: -71.5375 }

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180
}

/**
 * Great-circle Haversine distance in kilometers between two coordinates on Earth.
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth radius in km
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function resolveClosestCity(
  lat: number | null,
  lon: number | null,
  cityHint = "",
  regionHint = ""
): {
  city: CitySlug
  distanceLimaKm: number | null
  distanceArequipaKm: number | null
  source: string
} {
  const normalizedCity = cityHint.toLowerCase()
  const normalizedRegion = regionHint.toLowerCase()

  // Direct region/city match if explicitly inside Arequipa or Lima/Callao
  if (
    normalizedCity.includes("arequipa") ||
    normalizedRegion.includes("arequipa") ||
    normalizedRegion === "are"
  ) {
    const dLima =
      lat !== null && lon !== null
        ? Math.round(haversineDistanceKm(lat, lon, LIMA_COORDS.lat, LIMA_COORDS.lon))
        : null
    const dAqp =
      lat !== null && lon !== null
        ? Math.round(
            haversineDistanceKm(lat, lon, AREQUIPA_COORDS.lat, AREQUIPA_COORDS.lon)
          )
        : 0
    return {
      city: "arequipa",
      distanceLimaKm: dLima,
      distanceArequipaKm: dAqp,
      source: "region-match",
    }
  }

  if (
    normalizedCity.includes("lima") ||
    normalizedCity.includes("callao") ||
    normalizedRegion.includes("lima") ||
    normalizedRegion === "lim" ||
    normalizedRegion === "lma"
  ) {
    const dLima =
      lat !== null && lon !== null
        ? Math.round(haversineDistanceKm(lat, lon, LIMA_COORDS.lat, LIMA_COORDS.lon))
        : 0
    const dAqp =
      lat !== null && lon !== null
        ? Math.round(
            haversineDistanceKm(lat, lon, AREQUIPA_COORDS.lat, AREQUIPA_COORDS.lon)
          )
        : null
    return {
      city: "lima",
      distanceLimaKm: dLima,
      distanceArequipaKm: dAqp,
      source: "region-match",
    }
  }

  // Geodesic proximity comparison for any other location
  if (
    lat !== null &&
    lon !== null &&
    Number.isFinite(lat) &&
    Number.isFinite(lon)
  ) {
    const dLima = haversineDistanceKm(lat, lon, LIMA_COORDS.lat, LIMA_COORDS.lon)
    const dAqp = haversineDistanceKm(
      lat,
      lon,
      AREQUIPA_COORDS.lat,
      AREQUIPA_COORDS.lon
    )
    return {
      city: dAqp <= dLima ? "arequipa" : "lima",
      distanceLimaKm: Math.round(dLima),
      distanceArequipaKm: Math.round(dAqp),
      source: "haversine-proximity",
    }
  }

  return {
    city: "lima",
    distanceLimaKm: null,
    distanceArequipaKm: null,
    source: "default-fallback",
  }
}

function extractPublicClientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get("x-forwarded-for")
  const realIp = req.headers.get("x-real-ip")
  const candidate = (forwarded ? forwarded.split(",")[0] : realIp)?.trim() || ""
  if (
    !candidate ||
    candidate === "127.0.0.1" ||
    candidate === "::1" ||
    candidate.startsWith("192.168.") ||
    candidate.startsWith("10.") ||
    candidate.startsWith("172.16.") ||
    candidate.startsWith("fe80:")
  ) {
    return null
  }
  return candidate
}

export async function GET(req: NextRequest) {
  // 1. Check Vercel / Cloudflare Edge Geo headers first (0ms latency in production)
  const headerLatRaw =
    req.headers.get("x-vercel-ip-latitude") ?? req.headers.get("cf-iplatitude")
  const headerLonRaw =
    req.headers.get("x-vercel-ip-longitude") ??
    req.headers.get("cf-iplongitude")
  const headerCity =
    req.headers.get("x-vercel-ip-city") ?? req.headers.get("cf-ipcity") ?? ""
  const headerRegion =
    req.headers.get("x-vercel-ip-country-region") ??
    req.headers.get("cf-region") ??
    ""

  const headerLat = headerLatRaw !== null ? Number(headerLatRaw) : null
  const headerLon = headerLonRaw !== null ? Number(headerLonRaw) : null

  if (
    (headerLat !== null &&
      headerLon !== null &&
      Number.isFinite(headerLat) &&
      Number.isFinite(headerLon)) ||
    headerCity ||
    headerRegion
  ) {
    const resolved = resolveClosestCity(
      headerLat,
      headerLon,
      decodeURIComponent(headerCity),
      decodeURIComponent(headerRegion)
    )
    return NextResponse.json(
      {
        ...resolved,
        detectedCity: decodeURIComponent(headerCity) || null,
        detectedRegion: decodeURIComponent(headerRegion) || null,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    )
  }

  // 2. Fallback for Node.js server (SiteGround GoGeek or local dev) via ipwho.is
  try {
    const clientIp = extractPublicClientIp(req)
    const lookupUrl = clientIp
      ? `https://ipwho.is/${encodeURIComponent(clientIp)}`
      : "https://ipwho.is/"
    const res = await fetch(lookupUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    })
    if (res.ok) {
      const data = (await res.json()) as {
        success?: boolean
        latitude?: number
        longitude?: number
        city?: string
        region?: string
      }
      if (data.success !== false) {
        const lat =
          typeof data.latitude === "number" ? data.latitude : null
        const lon =
          typeof data.longitude === "number" ? data.longitude : null
        const resolved = resolveClosestCity(
          lat,
          lon,
          data.city ?? "",
          data.region ?? ""
        )
        return NextResponse.json(
          {
            ...resolved,
            detectedCity: data.city ?? null,
            detectedRegion: data.region ?? null,
          },
          { headers: { "Cache-Control": "no-store, max-age=0" } }
        )
      }
    }
  } catch {
    // Ignore external Geo-IP timeout
  }

  return NextResponse.json(
    {
      city: "lima" as CitySlug,
      distanceLimaKm: null,
      distanceArequipaKm: null,
      source: "fallback",
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  )
}
