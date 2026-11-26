"use client"

import type { CitySlug } from "@/lib/city-context"

// 2.5s cooldown only to avoid double-counting when clicking a Home card and immediately mounting the PDP 150ms later
const COOLDOWN_MS = 2500

export function trackProductClick(
  slug: string,
  type: "view" | "whatsapp" = "view",
  city: CitySlug = "lima"
): void {
  if (typeof window === "undefined" || !slug) return

  try {
    const storageKey = `da_clk_${type}_${slug}`
    const lastTs = Number(window.sessionStorage.getItem(storageKey) || "0")
    const now = Date.now()
    if (type === "view" && now - lastTs < COOLDOWN_MS) {
      return
    }
    window.sessionStorage.setItem(storageKey, String(now))
  } catch {
    // Ignore storage restriction
  }

  const payload = JSON.stringify({ slug, type, city })

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" })
      navigator.sendBeacon("/api/admin/clicks", blob)
      return
    }
  } catch {
    // Fallback to fetch
  }

  try {
    fetch("/api/admin/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Ignore network errors
  }
}
