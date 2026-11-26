"use client"

import type { CitySlug } from "@/lib/city-context"

const COOLDOWN_MS = 25000 // 25s deduplication per product in same session so card click + page mount count as 1 click

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
    fetch("/api/products/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Ignore network errors
  }
}
