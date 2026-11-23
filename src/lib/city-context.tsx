"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { usePathname, useRouter } from "next/navigation"

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

interface CityContextValue {
  city: CitySlug
  cityConfig: CitySeoConfig
  switchCity: (nextCity: CitySlug) => void
}

const CityContext = createContext<CityContextValue>({
  city: "lima",
  cityConfig: CITY_CONFIG.lima,
  switchCity: () => {},
})

export function CityProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const routeCity: CitySlug | null = useMemo(() => {
    if (!pathname) return null
    if (pathname === "/arequipa" || pathname.startsWith("/arequipa/")) {
      return "arequipa"
    }
    if (pathname === "/") {
      return "lima"
    }
    return null
  }, [pathname])

  const [storedCity, setStoredCity] = useState<CitySlug>("lima")

  useEffect(() => {
    if (routeCity) {
      setStoredCity(routeCity)
      try {
        window.localStorage.setItem(STORAGE_KEY, routeCity)
      } catch {
        // Ignore storage errors
      }
      return
    }

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === "arequipa" || saved === "lima") {
        setStoredCity(saved)
      }
    } catch {
      // Ignore storage errors
    }
  }, [routeCity])

  const activeCity: CitySlug = routeCity ?? storedCity

  const switchCity = useCallback(
    (nextCity: CitySlug) => {
      setStoredCity(nextCity)
      try {
        window.localStorage.setItem(STORAGE_KEY, nextCity)
      } catch {
        // Ignore storage errors
      }

      if (pathname === "/" && nextCity === "arequipa") {
        router.push("/arequipa")
      } else if (
        (pathname === "/arequipa" || pathname?.startsWith("/arequipa/")) &&
        nextCity === "lima"
      ) {
        router.push("/")
      }
    },
    [pathname, router]
  )

  const value = useMemo<CityContextValue>(
    () => ({
      city: activeCity,
      cityConfig: CITY_CONFIG[activeCity],
      switchCity,
    }),
    [activeCity, switchCity]
  )

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

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>
}

export function useCity(): CityContextValue {
  return useContext(CityContext)
}
