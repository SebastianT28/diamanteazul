"use client"

import React, {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { usePathname, useRouter } from "next/navigation"
import { PACKAGES_DATA, type InflatablePackage } from "@/data/packages"

export type CitySlug = "lima" | "arequipa"

export const LIMA_PRIORITY_DISTRICTS = [
  "San Isidro",
  "Miraflores",
  "Santiago de Surco",
  "San Borja",
  "Magdalena del Mar",
  "Surquillo",
  "San Luis",
] as const

export interface CitySeoConfig {
  slug: CitySlug
  name: string
  shortLabel: string
  homePath: "/" | "/arequipa"
  regionLabel: string
  districtsSummary: string
  coverageBadge: string
  coverageDescription: string
  heroSubtitle: string
  catalogSubtitle: string
  whatsappCityLabel: string
}

export const CITY_CONFIG: Record<CitySlug, CitySeoConfig> = {
  lima: {
    slug: "lima",
    name: "Lima",
    shortLabel: "Lima",
    homePath: "/",
    regionLabel: "Lima Moderna y Lima Metropolitana",
    districtsSummary:
      "San Isidro, Miraflores, Surco, San Borja, Magdalena del Mar, Surquillo, San Luis y zonas cercanas",
    coverageBadge:
      "Lima Moderna: San Isidro · Miraflores · Surco · San Borja · Magdalena del Mar · Surquillo · San Luis",
    coverageDescription:
      "Enfoque principal en Lima Moderna (San Isidro, Miraflores, Santiago de Surco, San Borja, Magdalena del Mar, Surquillo y San Luis), además de zonas cercanas donde sea viable brindar el servicio.",
    heroSubtitle:
      "Juegos inflables hermosos y seguros para cumpleaños y eventos inolvidables en Lima.",
    catalogSubtitle:
      "Explora nuestros 31 productos organizados por categoría para tu celebración en Lima Moderna (San Isidro, Miraflores, Surco, San Borja, Magdalena, Surquillo, San Luis y zonas cercanas).",
    whatsappCityLabel: "Lima",
  },
  arequipa: {
    slug: "arequipa",
    name: "Arequipa",
    shortLabel: "Arequipa",
    homePath: "/arequipa",
    regionLabel: "Ciudad de Arequipa",
    districtsSummary: "la ciudad de Arequipa",
    coverageBadge: "Cobertura en toda la ciudad de Arequipa",
    coverageDescription:
      "Atendemos cumpleaños infantiles, celebraciones familiares, colegios y eventos en la ciudad de Arequipa con traslado, montaje y personal de apoyo.",
    heroSubtitle:
      "Juegos inflables hermosos y seguros para cumpleaños y eventos inolvidables en Arequipa.",
    catalogSubtitle:
      "Explora nuestros 31 productos organizados por categoría para tu celebración en la ciudad de Arequipa.",
    whatsappCityLabel: "Arequipa",
  },
}

const STORAGE_KEY = "da_active_city"
const SESSION_MANUAL_KEY = "da_manual_city_selected"
const SESSION_GEO_KEY = "da_geo_detected_city"

interface CityContextValue {
  city: CitySlug
  cityConfig: CitySeoConfig
  switchCity: (nextCity: CitySlug) => void
  catalogProducts: InflatablePackage[]
}

const CityContext = createContext<CityContextValue>({
  city: "lima",
  cityConfig: CITY_CONFIG.lima,
  switchCity: () => {},
  catalogProducts: PACKAGES_DATA,
})

function CityPathnameWatcher({
  onPathname,
}: {
  onPathname: (p: string) => void
}) {
  const pathname = usePathname()
  useEffect(() => {
    if (pathname) onPathname(pathname)
  }, [pathname, onPathname])
  return null
}

export function CityProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [pathname, setPathname] = useState<string>("")
  const [catalogProducts, setCatalogProducts] =
    useState<InflatablePackage[]>(PACKAGES_DATA)

  const [storedCity, setStoredCity] = useState<CitySlug>("lima")

  // 1. Initial City Detection: Manual choice > Explicit /arequipa route > Silent Geo-IP Proximity (Lima vs Arequipa)
  useEffect(() => {
    let active = true

    // Check if user already made an explicit manual selection in this session
    try {
      const manualCity = window.sessionStorage.getItem(SESSION_MANUAL_KEY)
      if (manualCity === "lima" || manualCity === "arequipa") {
        setStoredCity(manualCity)
        return
      }
    } catch {
      // Ignore storage errors
    }

    // If user explicitly entered via /arequipa route without prior manual override, set Arequipa
    if (pathname === "/arequipa" || pathname.startsWith("/arequipa/")) {
      setStoredCity("arequipa")
      try {
        window.localStorage.setItem(STORAGE_KEY, "arequipa")
      } catch {
        // Ignore
      }
      return
    }

    try {
      const cachedGeo = window.sessionStorage.getItem(SESSION_GEO_KEY)
      if (cachedGeo === "lima" || cachedGeo === "arequipa") {
        setStoredCity(cachedGeo)
        return
      }
    } catch {
      // Ignore storage errors
    }

    // Silent proximity detection via /api/geo (Haversine distance to Lima vs Arequipa)
    ;(async () => {
      try {
        const res = await fetch("/api/geo", { cache: "no-store" })
        if (!res.ok) return
        const data = (await res.json()) as { city?: CitySlug }
        if (!active) return
        if (data.city === "lima" || data.city === "arequipa") {
          // Only apply if user hasn't clicked a city button in the meantime
          const manualNow = window.sessionStorage.getItem(SESSION_MANUAL_KEY)
          if (!manualNow) {
            setStoredCity(data.city)
            try {
              window.sessionStorage.setItem(SESSION_GEO_KEY, data.city)
              window.localStorage.setItem(STORAGE_KEY, data.city)
            } catch {
              // Ignore
            }
          }
        }
      } catch {
        // Fallback to saved localStorage preference if offline
        try {
          const saved = window.localStorage.getItem(STORAGE_KEY)
          if (saved === "arequipa" || saved === "lima") {
            setStoredCity(saved)
          }
        } catch {
          // Ignore
        }
      }
    })()

    return () => {
      active = false
    }
  }, [pathname])

  const activeCity: CitySlug = storedCity

  const switchCity = useCallback(
    (nextCity: CitySlug) => {
      setStoredCity(nextCity)
      try {
        window.sessionStorage.setItem(SESSION_MANUAL_KEY, nextCity)
        window.localStorage.setItem(STORAGE_KEY, nextCity)
      } catch {
        // Ignore storage errors
      }

      if (
        (pathname === "/arequipa" || pathname?.startsWith("/arequipa/")) &&
        nextCity === "lima"
      ) {
        router.replace("/", { scroll: false })
      }
    },
    [pathname, router]
  )

  const value = useMemo<CityContextValue>(() => {
    const baseConfig = CITY_CONFIG[activeCity]
    const currentHomePath: "/" | "/arequipa" =
      pathname === "/arequipa" || pathname?.startsWith("/arequipa/")
        ? "/arequipa"
        : "/"
    return {
      city: activeCity,
      cityConfig: {
        ...baseConfig,
        homePath: currentHomePath,
      },
      switchCity,
      catalogProducts,
    }
  }, [activeCity, pathname, switchCity, catalogProducts])

  // Live Catalog Products Synchronizer (reflects additions, edits, and deletions made in /admin)
  useEffect(() => {
    let active = true
    const loadCatalog = async () => {
      try {
        const res = await fetch("/api/products/catalog", { cache: "no-store" })
        if (!res.ok) return
        const data = (await res.json()) as {
          products?: InflatablePackage[]
        }
        if (active && Array.isArray(data.products) && data.products.length > 0) {
          setCatalogProducts(data.products)
        }
      } catch {
        // Ignore
      }
    }
    loadCatalog()
    window.addEventListener("da-refresh-catalog", loadCatalog)
    return () => {
      active = false
      window.removeEventListener("da-refresh-catalog", loadCatalog)
    }
  }, [pathname])

  // Live Image Overrides Synchronizer: applies any image modified in /admin across all pages
  useEffect(() => {
    let active = true
    let overridesMap: Record<string, string> = {}

    const applyOverridesToDom = () => {
      const keys = Object.keys(overridesMap)
      if (keys.length === 0) return
      const imgs = document.querySelectorAll<HTMLImageElement>("img")
      imgs.forEach((img) => {
        for (const origPath of keys) {
          const encodedPath = encodeURIComponent(origPath)
          const currentSrc = img.getAttribute("src") || ""
          const currentSrcSet = img.getAttribute("srcset") || ""
          if (
            currentSrc === origPath ||
            currentSrc.includes(encodedPath) ||
            currentSrcSet.includes(encodedPath)
          ) {
            const targetUrl = overridesMap[origPath]
            if (currentSrc !== targetUrl) {
              img.removeAttribute("srcset")
              img.setAttribute("src", targetUrl)
            }
          }
        }
      })
    }

    const loadManifest = async () => {
      try {
        const res = await fetch("/api/images/manifest", { cache: "no-store" })
        if (!res.ok) return
        const data = (await res.json()) as {
          overrides?: Record<string, string>
        }
        if (!active || !data.overrides) return
        overridesMap = data.overrides
        applyOverridesToDom()
      } catch {
        // Ignore
      }
    }

    loadManifest()
    window.addEventListener("da-refresh-image-overrides", loadManifest)

    const observer = new MutationObserver(() => {
      if (Object.keys(overridesMap).length > 0) {
        applyOverridesToDom()
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      active = false
      window.removeEventListener("da-refresh-image-overrides", loadManifest)
      observer.disconnect()
    }
  }, [pathname])

  return (
    <CityContext.Provider value={value}>
      <Suspense fallback={null}>
        <CityPathnameWatcher onPathname={setPathname} />
      </Suspense>
      {children}
    </CityContext.Provider>
  )
}

export function useCity(): CityContextValue {
  return useContext(CityContext)
}
