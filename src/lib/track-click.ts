"use client"

import type { CitySlug } from "@/lib/city-context"

export type ClickSource = "card" | "menu" | "pdp" | "cta"

export function trackProductClick(
  slug: string,
  type: "view" | "whatsapp" = "view",
  city: CitySlug = "lima",
  source: ClickSource = "pdp"
): void {
  if (typeof window === "undefined" || !slug) return

  const now = Date.now()

  try {
    if (type === "view") {
      const navKey = `da_nav_clk_${slug}`
      const pdpKey = `da_pdp_clk_${slug}`

      if (source === "card" || source === "menu") {
        // Explicit click on a card or menu item: always count and mark navigation so PDP mount doesn't double-count
        window.sessionStorage.setItem(navKey, String(now))
      } else {
        // Automatic PDP mount: skip if we just arrived from an explicit card/menu click within 4.5s
        const navTs = Number(window.sessionStorage.getItem(navKey) || "0")
        if (navTs > 0 && now - navTs < 4500) {
          window.sessionStorage.removeItem(navKey)
          return
        }
        // Also guard against React StrictMode double-invoking useEffect within 1.2s
        const lastPdpTs = Number(window.sessionStorage.getItem(pdpKey) || "0")
        if (lastPdpTs > 0 && now - lastPdpTs < 1200) {
          return
        }
        window.sessionStorage.setItem(pdpKey, String(now))
      }
    }
  } catch {
    // Ignore sessionStorage restrictions (e.g. private browsing)
  }

  const payload = JSON.stringify({ slug, type, city, ts: now })

  try {
    fetch("/api/admin/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
      cache: "no-store",
    }).catch(() => {
      try {
        if (typeof navigator !== "undefined" && navigator.sendBeacon) {
          const blob = new Blob([payload], { type: "application/json" })
          navigator.sendBeacon("/api/admin/clicks", blob)
        }
      } catch {
        // Ignore
      }
    })
  } catch {
    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" })
        navigator.sendBeacon("/api/admin/clicks", blob)
      }
    } catch {
      // Ignore
    }
  }
}
