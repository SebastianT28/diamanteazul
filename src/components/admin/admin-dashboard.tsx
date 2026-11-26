"use client"

import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import Link from "next/link"
import {
  ADMIN_IMAGE_SECTIONS,
  type AdminImageSection,
  type EditableImageSlot,
} from "@/data/site-images-catalog"
import {
  PRODUCT_CATEGORIES,
  type InflatablePackage,
  type ProductCategorySlug,
} from "@/data/packages"

interface EnrichedSlot extends EditableImageSlot {
  isOverridden: boolean
  updatedAt: number | null
  previewUrl: string
}

type AdminMainModule = "images" | "products" | "analytics"

interface AdminClickStatItem {
  slug: string
  title: string
  category: ProductCategorySlug
  categoryName: string
  collectionName: string
  image: string
  price: string
  viewClicksLima: number
  viewClicksArequipa: number
  totalViewClicks: number
  whatsappClicksLima: number
  whatsappClicksArequipa: number
  totalWhatsappClicks: number
  totalClicks: number
  lastClickedAt: number
}

interface ProductFormState {
  isEditing: boolean
  slug: string
  title: string
  category: ProductCategorySlug
  collectionName: string
  price: string
  dimensions: string
  cardDimensionTag: string
  rentalDurationTag: string
  subtitle: string
  description: string
  ages: string
  extraHour: string
  isNew: boolean
  bulletsText: string
  imagePath: string
  imageFile: File | null
  imagePreviewUrl: string
}

const DEFAULT_COLLECTION_BY_CATEGORY: Record<ProductCategorySlug, string> = {
  "castillos-toboganes": "Línea Dreamy Pastel",
  "inflables-acuaticos": "Juegos Acuáticos",
  "juegos-entretenimiento": "Juegos y Entretenimiento",
  "sesiones-fotos": "Sesiones Fotográficas",
  "complementos-extras": "Complementos",
}

const EMPTY_PRODUCT_FORM: ProductFormState = {
  isEditing: false,
  slug: "",
  title: "",
  category: "castillos-toboganes",
  collectionName: "Línea Dreamy Pastel",
  price: "S/ 450",
  dimensions: "4m × 4m × 3m",
  cardDimensionTag: "4m × 4m",
  rentalDurationTag: "5 hrs",
  subtitle: "",
  description: "",
  ages: "Niños (hasta 8 años)",
  extraHour: "S/ 70",
  isNew: true,
  bulletsText:
    "5 horas de alquiler con personal de apoyo incluido\nIncluye montaje, desmontaje y desinfección completa\nMaterial de alta resistencia y costuras reforzadas",
  imagePath: "",
  imageFile: null,
  imagePreviewUrl: "",
}

async function convertFileToWebp(file: File): Promise<File> {
  if (file.type === "image/webp" && file.size <= 600 * 1024) {
    return file
  }

  return new Promise((resolve) => {
    const img = new window.Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const maxDim = 1920
      let targetW = img.naturalWidth || img.width
      let targetH = img.naturalHeight || img.height

      if (targetW > maxDim || targetH > maxDim) {
        const ratio = Math.min(maxDim / targetW, maxDim / targetH)
        targetW = Math.round(targetW * ratio)
        targetH = Math.round(targetH * ratio)
      }

      const canvas = document.createElement("canvas")
      canvas.width = targetW
      canvas.height = targetH
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        resolve(file)
        return
      }

      ctx.drawImage(img, 0, 0, targetW, targetH)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file)
            return
          }
          const baseName = file.name.replace(/\.[^.]+$/, "")
          const webpFile = new File([blob], `${baseName}.webp`, {
            type: "image/webp",
          })
          resolve(webpFile)
        },
        "image/webp",
        0.85
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(file)
    }

    img.src = objectUrl
  })
}

export function AdminDashboard() {
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [activeUsername, setActiveUsername] = useState("admin")
  const [storageMode, setStorageMode] = useState<"mysql" | "local">("local")
  const [mysqlConfigured, setMysqlConfigured] = useState(false)
  const [activeModule, setActiveModule] = useState<AdminMainModule>("images")

  // Login form state
  const [loginUser, setLoginUser] = useState("")
  const [loginPass, setLoginPass] = useState("")
  const [showLoginPass, setShowLoginPass] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  // Image catalog state
  const [slots, setSlots] = useState<EnrichedSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [activeSection, setActiveSection] = useState<AdminImageSection | "all">(
    "all"
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [busySlotKey, setBusySlotKey] = useState<string | null>(null)

  // Product catalog state
  const [products, setProducts] = useState<InflatablePackage[]>([])
  const [deletedBaseProducts, setDeletedBaseProducts] = useState<
    InflatablePackage[]
  >([])
  const [customSlugs, setCustomSlugs] = useState<string[]>([])
  const [modifiedSlugs, setModifiedSlugs] = useState<string[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [activeProdCategory, setActiveProdCategory] = useState<
    ProductCategorySlug | "all"
  >("all")
  const [prodSearchQuery, setProdSearchQuery] = useState("")
  const [busyProductSlug, setBusyProductSlug] = useState<string | null>(null)

  // Product Create/Edit Modal state
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [productForm, setProductForm] =
    useState<ProductFormState>(EMPTY_PRODUCT_FORM)
  const [productSaving, setProductSaving] = useState(false)
  const [productFormError, setProductFormError] = useState("")

  // Delete confirmation modal state
  const [productToDelete, setProductToDelete] =
    useState<InflatablePackage | null>(null)

  // Click Analytics state
  const [clickItems, setClickItems] = useState<AdminClickStatItem[]>([])
  const [loadingClicks, setLoadingClicks] = useState(false)
  const [clickCityFilter, setClickCityFilter] = useState<
    "all" | "lima" | "arequipa"
  >("all")
  const [clickCategoryFilter, setClickCategoryFilter] = useState<
    ProductCategorySlug | "all"
  >("all")
  const [clickSearchQuery, setClickSearchQuery] = useState("")
  const [confirmResetAllClicks, setConfirmResetAllClicks] = useState(false)
  const [resettingClicks, setResettingClicks] = useState(false)

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{
    type: "ok" | "err"
    text: string
  } | null>(null)

  // Security / Change credentials modal state
  const [securityModalOpen, setSecurityModalOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newUsername, setNewUsername] = useState("admin")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [secError, setSecError] = useState("")
  const [secSuccess, setSecSuccess] = useState("")
  const [secLoading, setSecLoading] = useState(false)

  const showToast = useCallback((type: "ok" | "err", text: string) => {
    setToastMessage({ type, text })
    window.setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev))
    }, 4500)
  }, [])

  const fetchSlots = useCallback(async () => {
    setLoadingSlots(true)
    try {
      const res = await fetch("/api/admin/images", { cache: "no-store" })
      if (!res.ok) {
        if (res.status === 401) setAuthenticated(false)
        return
      }
      const data = (await res.json()) as {
        slots: EnrichedSlot[]
        mysqlConfigured: boolean
      }
      setSlots(data.slots)
      setMysqlConfigured(data.mysqlConfigured)
    } catch {
      showToast("err", "No se pudo cargar el listado de imágenes.")
    } finally {
      setLoadingSlots(false)
    }
  }, [showToast])

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true)
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" })
      if (!res.ok) {
        if (res.status === 401) setAuthenticated(false)
        return
      }
      const data = (await res.json()) as {
        products: InflatablePackage[]
        deletedBaseProducts: InflatablePackage[]
        customSlugs: string[]
        modifiedSlugs: string[]
      }
      setProducts(data.products)
      setDeletedBaseProducts(data.deletedBaseProducts ?? [])
      setCustomSlugs(data.customSlugs ?? [])
      setModifiedSlugs(data.modifiedSlugs ?? [])
    } catch {
      showToast("err", "No se pudo cargar el catálogo de productos.")
    } finally {
      setLoadingProducts(false)
    }
  }, [showToast])

  const fetchClicks = useCallback(
    async (silent?: boolean | unknown) => {
      const isSilent = silent === true
      if (!isSilent) setLoadingClicks(true)
      try {
        const res = await fetch("/api/admin/clicks", { cache: "no-store" })
        if (!res.ok) {
          if (res.status === 401) setAuthenticated(false)
          return
        }
        const data = (await res.json()) as {
          items: AdminClickStatItem[]
        }
        setClickItems(data.items ?? [])
      } catch {
        if (!isSilent) {
          showToast("err", "No se pudieron cargar las estadísticas de clics.")
        }
      } finally {
        if (!isSilent) setLoadingClicks(false)
      }
    },
    [showToast]
  )

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/admin/auth", { cache: "no-store" })
        const data = (await res.json()) as {
          authenticated: boolean
          username: string | null
          storageMode: "mysql" | "local"
          mysqlConfigured: boolean
        }
        if (!mounted) return
        setAuthenticated(data.authenticated)
        if (data.username) {
          setActiveUsername(data.username)
          setNewUsername(data.username)
        }
        setStorageMode(data.storageMode)
        setMysqlConfigured(data.mysqlConfigured)
        if (data.authenticated) {
          await Promise.all([fetchSlots(), fetchProducts(), fetchClicks(false)])
        }
      } catch {
        // Ignore
      } finally {
        if (mounted) setCheckingAuth(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [fetchSlots, fetchProducts, fetchClicks])

  useEffect(() => {
    if (!authenticated || resettingClicks) return
    const onFocus = () => {
      fetchClicks(true)
    }
    window.addEventListener("focus", onFocus)
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchClicks(true)
      }
    }, 5000)
    return () => {
      window.removeEventListener("focus", onFocus)
      window.clearInterval(interval)
    }
  }, [authenticated, resettingClicks, fetchClicks])

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          username: loginUser,
          password: loginPass,
        }),
      })
      const data = (await res.json()) as {
        ok?: boolean
        username?: string
        storageMode?: "mysql" | "local"
        error?: string
      }
      if (!res.ok || !data.ok) {
        setLoginError(data.error || "Usuario o contraseña incorrectos.")
        return
      }
      setAuthenticated(true)
      setActiveUsername(data.username || loginUser)
      setNewUsername(data.username || loginUser)
      if (data.storageMode) setStorageMode(data.storageMode)
      setLoginPass("")
      await Promise.all([fetchSlots(), fetchProducts(), fetchClicks()])
    } catch {
      setLoginError("No se pudo conectar con el servidor.")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    })
    setAuthenticated(false)
    setSlots([])
    setProducts([])
  }

  const handleUploadImage = async (slot: EnrichedSlot, rawFile: File) => {
    setBusySlotKey(slot.key)
    try {
      const optimizedFile = await convertFileToWebp(rawFile)
      const formData = new FormData()
      formData.append("slotKey", slot.key)
      formData.append("file", optimizedFile)

      const res = await fetch("/api/admin/images", {
        method: "POST",
        body: formData,
      })
      const data = (await res.json()) as {
        ok?: boolean
        updatedAt?: number
        previewUrl?: string
        error?: string
      }

      if (!res.ok || !data.ok) {
        showToast("err", data.error || "No se pudo actualizar la imagen.")
        return
      }

      setSlots((prev) =>
        prev.map((item) =>
          item.key === slot.key
            ? {
                ...item,
                isOverridden: true,
                updatedAt: data.updatedAt ?? Date.now(),
                previewUrl:
                  data.previewUrl ??
                  `/api/media/${slot.key}?v=${Date.now()}`,
              }
            : item
        )
      )
      window.dispatchEvent(new CustomEvent("da-refresh-image-overrides"))
      window.dispatchEvent(new CustomEvent("da-refresh-catalog"))
      await fetchProducts()
      showToast("ok", `Imagen actualizada en formato Webp: ${slot.title}`)
    } catch {
      showToast("err", "Error de red al subir la imagen.")
    } finally {
      setBusySlotKey(null)
    }
  }

  const handleRestoreImage = async (slot: EnrichedSlot) => {
    setBusySlotKey(slot.key)
    try {
      const res = await fetch(
        `/api/admin/images?key=${encodeURIComponent(slot.key)}`,
        { method: "DELETE" }
      )
      const data = (await res.json()) as {
        ok?: boolean
        previewUrl?: string
        error?: string
      }
      if (!res.ok || !data.ok) {
        showToast("err", data.error || "No se pudo restaurar la imagen.")
        return
      }

      setSlots((prev) =>
        prev.map((item) =>
          item.key === slot.key
            ? {
                ...item,
                isOverridden: false,
                updatedAt: null,
                previewUrl: `${slot.path}?v=${Date.now()}`,
              }
            : item
        )
      )
      window.dispatchEvent(new CustomEvent("da-refresh-image-overrides"))
      window.dispatchEvent(new CustomEvent("da-refresh-catalog"))
      await fetchProducts()
      showToast("ok", `Imagen restaurada a su versión original: ${slot.title}`)
    } catch {
      showToast("err", "Error de red al restaurar la imagen.")
    } finally {
      setBusySlotKey(null)
    }
  }

  // Open Modal to Create New Product
  const openCreateProductModal = () => {
    setProductFormError("")
    setProductForm({ ...EMPTY_PRODUCT_FORM })
    setProductModalOpen(true)
  }

  // Open Modal to Edit/Modify Existing Product
  const openEditProductModal = (pkg: InflatablePackage) => {
    setProductFormError("")
    const extraHourSpec = pkg.tableSpecs.find(
      (r) => r.label.toLowerCase() === "hora adicional"
    )?.value
    setProductForm({
      isEditing: true,
      slug: pkg.slug,
      title: pkg.title,
      category: pkg.category,
      collectionName: pkg.collectionName,
      price: pkg.price,
      dimensions: pkg.specs.minSpace || pkg.cardTags[0] || "4m × 4m × 3m",
      cardDimensionTag: pkg.cardTags[0] || pkg.specs.minSpace,
      rentalDurationTag: pkg.cardTags[1] || "5 hrs",
      subtitle: pkg.subtitle,
      description: pkg.fullDescription || pkg.shortDescription,
      ages: pkg.specs.recommendedAges || "Todas las edades",
      extraHour: extraHourSpec || "",
      isNew: Boolean(pkg.isNew),
      bulletsText: pkg.featureBullets.map((b) => b.text).join("\n"),
      imagePath: pkg.image,
      imageFile: null,
      imagePreviewUrl: pkg.image,
    })
    setProductModalOpen(true)
  }

  const handleSaveProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProductFormError("")

    if (!productForm.title.trim()) {
      setProductFormError("Ingresa el nombre del producto.")
      return
    }
    if (!productForm.price.trim()) {
      setProductFormError("Ingresa el precio de alquiler.")
      return
    }
    if (!productForm.dimensions.trim()) {
      setProductFormError("Ingresa las medidas del producto.")
      return
    }
    if (!productForm.isEditing && !productForm.imageFile && !productForm.imagePath) {
      setProductFormError(
        "Selecciona una imagen para el nuevo producto (se guardará en formato Webp)."
      )
      return
    }

    setProductSaving(true)
    try {
      const formData = new FormData()
      if (productForm.slug) formData.append("slug", productForm.slug)
      formData.append("title", productForm.title.trim())
      formData.append("category", productForm.category)
      formData.append("collectionName", productForm.collectionName.trim())
      formData.append("price", productForm.price.trim())
      formData.append("dimensions", productForm.dimensions.trim())
      formData.append("cardDimensionTag", productForm.cardDimensionTag.trim())
      formData.append("rentalDurationTag", productForm.rentalDurationTag.trim())
      formData.append("subtitle", productForm.subtitle.trim())
      formData.append("description", productForm.description.trim())
      formData.append("ages", productForm.ages.trim())
      formData.append("extraHour", productForm.extraHour.trim())
      formData.append("isNew", productForm.isNew ? "true" : "false")
      formData.append("bulletsText", productForm.bulletsText.trim())
      if (productForm.imagePath) {
        formData.append("imagePath", productForm.imagePath)
      }

      if (productForm.imageFile) {
        const webpFile = await convertFileToWebp(productForm.imageFile)
        formData.append("file", webpFile)
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      })
      const data = (await res.json()) as {
        ok?: boolean
        product?: InflatablePackage
        error?: string
      }

      if (!res.ok || !data.ok) {
        setProductFormError(
          data.error || "No se pudo guardar el producto."
        )
        return
      }

      setProductModalOpen(false)
      await Promise.all([fetchProducts(), fetchSlots()])
      window.dispatchEvent(new CustomEvent("da-refresh-catalog"))
      showToast(
        "ok",
        productForm.isEditing
          ? `Producto modificado: ${productForm.title}`
          : `Nuevo producto agregado al catálogo: ${productForm.title}`
      )
    } catch {
      setProductFormError("Error de red al guardar el producto.")
    } finally {
      setProductSaving(false)
    }
  }

  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return
    const target = productToDelete
    setBusyProductSlug(target.slug)
    setProductToDelete(null)

    try {
      const res = await fetch(
        `/api/admin/products?slug=${encodeURIComponent(target.slug)}&mode=delete`,
        { method: "DELETE" }
      )
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        showToast("err", data.error || "No se pudo eliminar el producto.")
        return
      }
      await fetchProducts()
      window.dispatchEvent(new CustomEvent("da-refresh-catalog"))
      showToast("ok", `Producto eliminado del catálogo: ${target.title}`)
    } catch {
      showToast("err", "Error de red al eliminar el producto.")
    } finally {
      setBusyProductSlug(null)
    }
  }

  const handleRestoreBaseProduct = async (slug: string, title: string) => {
    setBusyProductSlug(slug)
    try {
      const res = await fetch(
        `/api/admin/products?slug=${encodeURIComponent(slug)}&mode=restore`,
        { method: "DELETE" }
      )
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        showToast("err", data.error || "No se pudo restaurar el producto.")
        return
      }
      await fetchProducts()
      window.dispatchEvent(new CustomEvent("da-refresh-catalog"))
      showToast("ok", `Producto restaurado a su versión original: ${title}`)
    } catch {
      showToast("err", "Error de red al restaurar el producto.")
    } finally {
      setBusyProductSlug(null)
    }
  }

  const handleResetClicks = async (targetSlug: string = "all") => {
    setResettingClicks(true)
    try {
      const res = await fetch(
        `/api/admin/clicks?slug=${encodeURIComponent(targetSlug)}`,
        { method: "DELETE" }
      )
      if (!res.ok) {
        showToast("err", "No se pudieron reiniciar los contadores.")
        return
      }
      setConfirmResetAllClicks(false)
      await fetchClicks()
      showToast(
        "ok",
        targetSlug === "all"
          ? "Todos los contadores de clics fueron reiniciados a 0."
          : "Contador del producto reiniciado a 0."
      )
    } catch {
      showToast("err", "Error de red al reiniciar contadores.")
    } finally {
      setResettingClicks(false)
    }
  }

  const handleChangeCredentials = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSecError("")
    setSecSuccess("")

    if (newPassword !== confirmPassword) {
      setSecError("La nueva contraseña y su confirmación no coinciden.")
      return
    }
    if (newPassword.length < 8) {
      setSecError("La nueva contraseña debe tener al menos 8 caracteres.")
      return
    }

    setSecLoading(true)
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change-credentials",
          currentPassword,
          newUsername,
          newPassword,
        }),
      })
      const data = (await res.json()) as {
        ok?: boolean
        username?: string
        message?: string
        error?: string
      }
      if (!res.ok || !data.ok) {
        setSecError(data.error || "No se pudieron actualizar las credenciales.")
        return
      }
      setActiveUsername(data.username || newUsername)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setSecSuccess(
        data.message || "Usuario y contraseña actualizados con éxito."
      )
    } catch {
      setSecError("Error de conexión al actualizar credenciales.")
    } finally {
      setSecLoading(false)
    }
  }

  const filteredSlots = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return slots.filter((s) => {
      if (activeSection !== "all" && s.section !== activeSection) return false
      if (!q) return true
      return (
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.path.toLowerCase().includes(q)
      )
    })
  }, [slots, activeSection, searchQuery])

  const filteredProducts = useMemo(() => {
    const q = prodSearchQuery.trim().toLowerCase()
    return products.filter((p) => {
      if (activeProdCategory !== "all" && p.category !== activeProdCategory)
        return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.collectionName.toLowerCase().includes(q) ||
        p.price.toLowerCase().includes(q)
      )
    })
  }, [products, activeProdCategory, prodSearchQuery])

  const overriddenCount = useMemo(
    () => slots.filter((s) => s.isOverridden).length,
    [slots]
  )

  const clicksBySlug = useMemo(() => {
    const map: Record<string, AdminClickStatItem> = {}
    for (const item of clickItems) {
      map[item.slug] = item
    }
    return map
  }, [clickItems])

  const rankedAnalyticsItems = useMemo(() => {
    const q = clickSearchQuery.trim().toLowerCase()
    const mapped = clickItems
      .filter((item) => {
        if (
          clickCategoryFilter !== "all" &&
          item.category !== clickCategoryFilter
        ) {
          return false
        }
        if (!q) return true
        return (
          item.title.toLowerCase().includes(q) ||
          item.categoryName.toLowerCase().includes(q)
        )
      })
      .map((item) => {
        const viewCount =
          clickCityFilter === "lima"
            ? item.viewClicksLima
            : clickCityFilter === "arequipa"
              ? item.viewClicksArequipa
              : item.totalViewClicks
        const waCount =
          clickCityFilter === "lima"
            ? item.whatsappClicksLima
            : clickCityFilter === "arequipa"
              ? item.whatsappClicksArequipa
              : item.totalWhatsappClicks
        return {
          ...item,
          activeViewClicks: viewCount,
          activeWaClicks: waCount,
        }
      })

    mapped.sort((a, b) => {
      if (b.activeViewClicks !== a.activeViewClicks) {
        return b.activeViewClicks - a.activeViewClicks
      }
      return b.activeWaClicks - a.activeWaClicks
    })
    return mapped
  }, [clickItems, clickCategoryFilter, clickCityFilter, clickSearchQuery])

  const analyticsSummary = useMemo(() => {
    let totalViews = 0
    let viewsLima = 0
    let viewsAqp = 0
    let totalWa = 0
    const categoryTotals: Record<string, { label: string; clicks: number }> = {}

    for (const item of clickItems) {
      viewsLima += item.viewClicksLima
      viewsAqp += item.viewClicksArequipa
      const activeViews =
        clickCityFilter === "lima"
          ? item.viewClicksLima
          : clickCityFilter === "arequipa"
            ? item.viewClicksArequipa
            : item.totalViewClicks
      const activeWa =
        clickCityFilter === "lima"
          ? item.whatsappClicksLima
          : clickCityFilter === "arequipa"
            ? item.whatsappClicksArequipa
            : item.totalWhatsappClicks

      totalViews += activeViews
      totalWa += activeWa

      if (!categoryTotals[item.category]) {
        categoryTotals[item.category] = {
          label: item.categoryName,
          clicks: 0,
        }
      }
      categoryTotals[item.category].clicks += activeViews
    }

    const topProduct =
      rankedAnalyticsItems.length > 0 &&
      rankedAnalyticsItems[0].activeViewClicks > 0
        ? rankedAnalyticsItems[0]
        : null

    let topCategory: { label: string; clicks: number } | null = null
    for (const cat of Object.values(categoryTotals)) {
      if (cat.clicks > 0 && (!topCategory || cat.clicks > topCategory.clicks)) {
        topCategory = cat
      }
    }

    return {
      totalViews,
      viewsLima,
      viewsAqp,
      totalWa,
      topProduct,
      topCategory,
    }
  }, [clickItems, clickCityFilter, rankedAnalyticsItems])

  if (checkingAuth) {
    return (
      <main className="min-h-[75vh] flex items-center justify-center px-6 py-16 bg-[#F7FAFC]">
        <div className="text-center text-[#5A6577] text-base font-medium">
          Verificando sesión de administrador...
        </div>
      </main>
    )
  }

  if (!authenticated) {
    return (
      <main className="min-h-[82vh] flex items-center justify-center px-5 py-16 bg-[#F7FAFC]">
        <section
          aria-labelledby="da-admin-login-title"
          className="w-full max-w-[440px] rounded-[28px] bg-white p-8 sm:p-10 shadow-[0_18px_50px_rgba(45,52,64,0.08)] border border-[#E3ECF2]"
        >
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#EBF5FA] text-[#2B8EAD] mb-3">
              Acceso Restringido
            </span>
            <h1
              id="da-admin-login-title"
              className="text-2xl sm:text-[28px] font-semibold text-[#2D3440] tracking-tight"
            >
              Panel Administrador
            </h1>
            <p className="mt-1.5 text-sm text-[#6C7686]">
              Ingresa tus credenciales para gestionar las imágenes y productos
              de Diamante Azul.
            </p>
          </div>

          {loginError && (
            <div
              role="alert"
              className="mb-5 rounded-2xl bg-[#FFF1F3] border border-[#F8C6D0] px-4 py-3 text-sm text-[#B4233C] font-medium"
            >
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="da-admin-user"
                className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1.5"
              >
                Usuario
              </label>
              <input
                id="da-admin-user"
                type="text"
                required
                autoComplete="username"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="w-full h-12 px-4 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-[#2D3440] text-sm focus:outline-none focus:border-[#5CC2DE] focus:bg-white transition"
              />
            </div>

            <div>
              <label
                htmlFor="da-admin-pass"
                className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="da-admin-pass"
                  type={showLoginPass ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-4 pr-20 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-[#2D3440] text-sm focus:outline-none focus:border-[#5CC2DE] focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#2B8EAD] hover:underline px-2 py-1"
                >
                  {showLoginPass ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full h-12 mt-2 rounded-full bg-[#2D3440] hover:bg-[#5CC2DE] text-white font-semibold text-sm transition shadow-md disabled:opacity-60 cursor-pointer"
            >
              {loginLoading ? "Verificando..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#EBF1F5] text-center">
            <Link
              href="/"
              className="text-xs font-medium text-[#6C7686] hover:text-[#2D3440] transition"
            >
              ← Volver al sitio web público
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F5F9FC] pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 max-w-md rounded-2xl px-5 py-3.5 text-sm font-medium shadow-xl border transition ${
            toastMessage.type === "ok"
              ? "bg-[#2D3440] text-white border-[#3F4857]"
              : "bg-[#FFF1F3] text-[#B4233C] border-[#F8C6D0]"
          }`}
        >
          {toastMessage.text}
        </div>
      )}

      {/* Top Admin Header Bar */}
      <div className="bg-white border-b border-[#E2ECF2]">
        <div className="max-w-[1380px] mx-auto px-5 sm:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-[#EBF5FA] text-[#2B8EAD]">
                Panel Administrador · Diamante Azul
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium ${
                  mysqlConfigured && storageMode === "mysql"
                    ? "bg-[#E6F7ED] text-[#1D7A46]"
                    : "bg-[#FFF6E5] text-[#9A6300]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current" />
                {mysqlConfigured && storageMode === "mysql"
                  ? "MySQL Conectado (SiteGround)"
                  : "Modo Local Activo (Listo para MySQL en SiteGround)"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#2D3440] tracking-tight">
              Administración de Imágenes y Productos
            </h1>
            <p className="text-sm text-[#6C7686] mt-0.5">
              Sesión iniciada como <strong>{activeUsername}</strong> ·{" "}
              <strong>{products.length} productos activos</strong> en catálogo y{" "}
              <strong>{slots.length} imágenes</strong> del sitio (
              {overriddenCount}{" "}
              {overriddenCount === 1 ? "modificada" : "modificadas"}).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setSecError("")
                setSecSuccess("")
                setSecurityModalOpen(true)
              }}
              className="px-4 py-2.5 rounded-full border border-[#D4E2EC] bg-[#F7FAFC] hover:bg-[#EBF5FA] text-[#2D3440] text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              🔒 Cambiar usuario / contraseña
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-full border border-[#F3CCD3] bg-[#FFF5F7] hover:bg-[#FFE6EB] text-[#B4233C] text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Main Module Switcher Bar: 1. Imágenes del Sitio | 2. Productos del Catálogo */}
        <div className="max-w-[1380px] mx-auto px-5 sm:px-8 pb-4 flex flex-wrap items-center justify-between gap-3">
          <div
            className="inline-flex p-1.5 rounded-full bg-[#EEF4F8] border border-[#DCE7F0]"
            role="tablist"
            aria-label="Módulos del panel administrador"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeModule === "images"}
              onClick={() => setActiveModule("images")}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeModule === "images"
                  ? "bg-[#2D3440] text-white shadow-sm"
                  : "text-[#5A6577] hover:text-[#2D3440]"
              }`}
            >
              🖼️ Imágenes del Sitio ({slots.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeModule === "products"}
              onClick={() => setActiveModule("products")}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeModule === "products"
                  ? "bg-[#2D3440] text-white shadow-sm"
                  : "text-[#5A6577] hover:text-[#2D3440]"
              }`}
            >
              🎪 Productos del Catálogo ({products.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeModule === "analytics"}
              onClick={() => {
                setActiveModule("analytics")
                fetchClicks()
              }}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeModule === "analytics"
                  ? "bg-[#2D3440] text-white shadow-sm"
                  : "text-[#5A6577] hover:text-[#2D3440]"
              }`}
            >
              📊 Más Clickeados ({analyticsSummary.totalViews})
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveModule("products")
              openCreateProductModal()
            }}
            className="px-5 py-2.5 rounded-full bg-[#2B8EAD] hover:bg-[#237792] text-white text-xs sm:text-sm font-semibold shadow-sm transition cursor-pointer inline-flex items-center gap-1.5"
          >
            <span className="text-base leading-none">+</span>
            <span>Agregar nuevo producto</span>
          </button>
        </div>
      </div>

      {/* ====================================================================
          MODULE 1: GESTOR DE IMÁGENES DEL SITIO WEB
          ==================================================================== */}
      {activeModule === "images" && (
        <div className="max-w-[1380px] mx-auto px-5 sm:px-8 pt-7">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E2ECF2] shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Filtrar imágenes por sección"
            >
              {ADMIN_IMAGE_SECTIONS.map((sec) => {
                const isActive = activeSection === sec.id
                const count =
                  sec.id === "all"
                    ? slots.length
                    : slots.filter((s) => s.section === sec.id).length
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setActiveSection(sec.id)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition cursor-pointer ${
                      isActive
                        ? "bg-[#2D3440] text-white font-semibold shadow-sm"
                        : "bg-[#F2F7FA] text-[#5A6577] hover:bg-[#E5F0F6]"
                    }`}
                  >
                    {sec.label} ({count})
                  </button>
                )
              })}
            </div>

            <div className="relative w-full lg:w-72">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar imagen o sección..."
                aria-label="Buscar imagen por nombre"
                className="w-full h-10 pl-4 pr-9 rounded-full border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440] focus:outline-none focus:border-[#5CC2DE] focus:bg-white"
              />
            </div>
          </div>

          {loadingSlots ? (
            <div className="py-20 text-center text-[#6C7686] text-base">
              Cargando catálogo de imágenes...
            </div>
          ) : filteredSlots.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl mt-6 border border-[#E2ECF2] p-8">
              <p className="text-base font-medium text-[#2D3440]">
                No se encontraron imágenes con ese filtro.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredSlots.map((slot) => {
                const isBusy = busySlotKey === slot.key
                const inputId = `upload-input-${slot.key}`
                return (
                  <article
                    key={slot.key}
                    className="bg-white rounded-[24px] border border-[#E2ECF2] overflow-hidden shadow-[0_6px_20px_rgba(45,52,64,0.04)] flex flex-col justify-between transition hover:shadow-[0_12px_28px_rgba(45,52,64,0.08)]"
                  >
                    <div>
                      <div className="relative aspect-[4/3] w-full bg-[#EEF4F8] overflow-hidden border-b border-[#EBF1F5]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={slot.previewUrl}
                          alt={slot.title}
                          loading="lazy"
                          className="w-full h-full object-contain p-2"
                        />
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-[#2D3440] backdrop-blur-sm shadow-sm">
                            {slot.sectionLabel}
                          </span>
                          {slot.isOverridden && (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#2B8EAD] text-white shadow-sm">
                              Modificada
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4">
                        <h2 className="text-base font-semibold text-[#2D3440] leading-snug">
                          {slot.title}
                        </h2>
                        <p className="text-xs text-[#6C7686] mt-1 line-clamp-2">
                          {slot.subtitle}
                        </p>
                        <div className="mt-3 pt-2.5 border-t border-[#F0F4F8] text-[11.5px] text-[#5A6577] space-y-1">
                          <p>
                            <strong>Medida sugerida:</strong>{" "}
                            {slot.recommendedSize}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <strong>Formato:</strong>{" "}
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#EBF5FA] text-[#2B8EAD] font-bold tracking-wide">
                              {slot.recommendedFormat || "Webp"}
                            </span>
                          </p>
                          <p
                            className="truncate text-[11px] text-[#7A8699]"
                            title={slot.path}
                          >
                            <strong>Ruta:</strong> {slot.path}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-1 flex items-center gap-2">
                      <input
                        id={inputId}
                        type="file"
                        accept="image/webp,image/jpeg,image/png,image/avif"
                        className="sr-only"
                        disabled={isBusy}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          e.target.value = ""
                          if (file) {
                            handleUploadImage(slot, file)
                          }
                        }}
                      />
                      <label
                        htmlFor={inputId}
                        className={`flex-1 h-10 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          isBusy
                            ? "bg-[#CFD9E2] text-[#5A6577] pointer-events-none"
                            : "bg-[#2D3440] hover:bg-[#5CC2DE] text-white shadow-sm"
                        }`}
                      >
                        {isBusy ? "Subiendo..." : "Cambiar imagen"}
                      </label>

                      {slot.isOverridden && (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleRestoreImage(slot)}
                          title="Restaurar imagen original"
                          className="h-10 px-3.5 rounded-full border border-[#D7E3EC] bg-[#F7FAFC] hover:bg-[#FFF1F3] hover:border-[#F8C6D0] hover:text-[#B4233C] text-[#5A6577] text-xs font-semibold transition cursor-pointer"
                        >
                          Restaurar
                        </button>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          MODULE 2: GESTOR DE PRODUCTOS DEL CATÁLOGO (VER, CREAR, EDITAR, ELIMINAR)
          ==================================================================== */}
      {activeModule === "products" && (
        <div className="max-w-[1380px] mx-auto px-5 sm:px-8 pt-7">
          {/* Products Filter & Search Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E2ECF2] shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Filtrar productos por categoría"
            >
              <button
                type="button"
                onClick={() => setActiveProdCategory("all")}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition cursor-pointer ${
                  activeProdCategory === "all"
                    ? "bg-[#2D3440] text-white font-semibold shadow-sm"
                    : "bg-[#F2F7FA] text-[#5A6577] hover:bg-[#E5F0F6]"
                }`}
              >
                Todos ({products.length})
              </button>
              {PRODUCT_CATEGORIES.map((cat) => {
                const isActive = activeProdCategory === cat.slug
                const count = products.filter(
                  (p) => p.category === cat.slug
                ).length
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setActiveProdCategory(cat.slug)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition cursor-pointer ${
                      isActive
                        ? "bg-[#2D3440] text-white font-semibold shadow-sm"
                        : "bg-[#F2F7FA] text-[#5A6577] hover:bg-[#E5F0F6]"
                    }`}
                  >
                    {cat.label} ({count})
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <input
                type="search"
                value={prodSearchQuery}
                onChange={(e) => setProdSearchQuery(e.target.value)}
                placeholder="Buscar producto por nombre..."
                aria-label="Buscar producto"
                className="w-full lg:w-64 h-10 pl-4 pr-4 rounded-full border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440] focus:outline-none focus:border-[#5CC2DE] focus:bg-white"
              />
            </div>
          </div>

          {/* Active Products Grid */}
          {loadingProducts ? (
            <div className="py-20 text-center text-[#6C7686] text-base">
              Cargando productos del catálogo...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl mt-6 border border-[#E2ECF2] p-8">
              <p className="text-base font-medium text-[#2D3440]">
                No se encontraron productos en esta categoría.
              </p>
              <button
                type="button"
                onClick={openCreateProductModal}
                className="mt-4 px-5 py-2.5 rounded-full bg-[#2B8EAD] text-white text-xs font-semibold cursor-pointer"
              >
                + Agregar nuevo producto
              </button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((pkg) => {
                const isBusy = busyProductSlug === pkg.slug
                const isCustom = customSlugs.includes(pkg.slug)
                const isModified = modifiedSlugs.includes(pkg.slug)
                return (
                  <article
                    key={pkg.slug}
                    className="bg-white rounded-[24px] border border-[#E2ECF2] overflow-hidden shadow-[0_6px_20px_rgba(45,52,64,0.04)] flex flex-col justify-between transition hover:shadow-[0_12px_28px_rgba(45,52,64,0.08)]"
                  >
                    <div>
                      <div className="relative aspect-square w-full bg-[#EEF4F8] overflow-hidden border-b border-[#EBF1F5]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/92 text-[#2D3440] backdrop-blur-sm shadow-sm">
                            {pkg.categoryName}
                          </span>
                          {isCustom ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#1D7A46] text-white shadow-sm">
                              Nuevo Creado
                            </span>
                          ) : isModified ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#2B8EAD] text-white shadow-sm">
                              Editado
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="text-base font-semibold text-[#2D3440] leading-snug">
                            {pkg.title}
                          </h2>
                          <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-[#F2F7FA] text-[#2D3440] text-xs font-bold">
                            {pkg.price}
                          </span>
                        </div>
                        <p className="text-xs text-[#6C7686] mt-1 line-clamp-2">
                          {pkg.subtitle}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                          <span className="px-2.5 py-1 rounded-lg bg-[#EBF5FA] text-[#2B8EAD] font-semibold">
                            👆 {clicksBySlug[pkg.slug]?.totalViewClicks ?? 0}{" "}
                            {(clicksBySlug[pkg.slug]?.totalViewClicks ?? 0) === 1
                              ? "clic"
                              : "clics"}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-[#F5F8FA] text-[#5A6577] font-medium">
                            <strong>Medidas:</strong> {pkg.cardTags[0]}
                          </span>
                          {pkg.cardTags[1] && (
                            <span className="px-2.5 py-1 rounded-lg bg-[#F5F8FA] text-[#5A6577] font-medium">
                              <strong>Alquiler:</strong> {pkg.cardTags[1]}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#F0F4F8] text-[11.5px] text-[#5A6577] space-y-1">
                          <p>
                            <strong>Medida sugerida:</strong> 1000 × 1000 px
                            (1:1)
                          </p>
                          <p className="flex items-center gap-1.5">
                            <strong>Formato:</strong>{" "}
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#EBF5FA] text-[#2B8EAD] font-bold tracking-wide">
                              Webp
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-1 flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => openEditProductModal(pkg)}
                        className="flex-1 h-10 rounded-full bg-[#2D3440] hover:bg-[#5CC2DE] text-white text-xs font-semibold transition cursor-pointer shadow-sm"
                      >
                        ✏️ Editar / Modificar
                      </button>

                      {isModified && !isCustom && (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() =>
                            handleRestoreBaseProduct(pkg.slug, pkg.title)
                          }
                          title="Restaurar datos originales del producto"
                          className="h-10 px-3 rounded-full border border-[#D7E3EC] bg-[#F7FAFC] hover:bg-[#EBF5FA] text-[#5A6577] text-xs font-semibold transition cursor-pointer"
                        >
                          ↺
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => setProductToDelete(pkg)}
                        title="Eliminar producto del catálogo"
                        className="h-10 px-3.5 rounded-full border border-[#F3CCD3] bg-[#FFF5F7] hover:bg-[#FFE6EB] text-[#B4233C] text-xs font-semibold transition cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {/* Deleted Base Products Recovery Section */}
          {deletedBaseProducts.length > 0 && (
            <section className="mt-10 bg-white rounded-3xl p-6 border border-[#E2ECF2]">
              <h3 className="text-base font-semibold text-[#2D3440]">
                Productos del catálogo base ocultos / eliminados (
                {deletedBaseProducts.length})
              </h3>
              <p className="text-xs text-[#6C7686] mt-0.5 mb-4">
                Si eliminaste un producto original por error, puedes restaurarlo
                al catálogo con un clic:
              </p>
              <div className="flex flex-wrap gap-2.5">
                {deletedBaseProducts.map((delPkg) => (
                  <div
                    key={delPkg.slug}
                    className="inline-flex items-center gap-2.5 pl-3.5 pr-2 py-1.5 rounded-full bg-[#F5F9FC] border border-[#D7E3EC] text-xs"
                  >
                    <span className="font-medium text-[#2D3440]">
                      {delPkg.title}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleRestoreBaseProduct(delPkg.slug, delPkg.title)
                      }
                      className="px-3 py-1 rounded-full bg-[#2B8EAD] text-white font-semibold hover:bg-[#22748F] cursor-pointer"
                    >
                      Restaurar
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ====================================================================
          MODULE 3: RANKING DE INFLABLES MÁS CLICKEADOS / ESTADÍSTICAS
          ==================================================================== */}
      {activeModule === "analytics" && (
        <div className="max-w-[1380px] mx-auto px-5 sm:px-8 pt-7">
          {/* 4 Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-[24px] p-5 border border-[#E2ECF2] shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6C7686]">
                Total de Clics en Inflables
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#2D3440]">
                  {analyticsSummary.totalViews}
                </span>
                <span className="text-xs font-medium text-[#2B8EAD]">
                  clics registrados
                </span>
              </div>
              <p className="mt-2 text-xs text-[#6C7686]">
                Lima: <strong>{analyticsSummary.viewsLima}</strong> · Arequipa:{" "}
                <strong>{analyticsSummary.viewsAqp}</strong>
              </p>
            </div>

            <div className="bg-white rounded-[24px] p-5 border border-[#E2ECF2] shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6C7686]">
                🥇 Inflable #1 Más Clickeado
              </span>
              {analyticsSummary.topProduct ? (
                <div className="mt-2 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={analyticsSummary.topProduct.image}
                    alt={analyticsSummary.topProduct.title}
                    className="w-12 h-12 rounded-xl object-cover border border-[#E2ECF2] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#2D3440] truncate">
                      {analyticsSummary.topProduct.title}
                    </p>
                    <p className="text-xs font-semibold text-[#1D7A46]">
                      {analyticsSummary.topProduct.activeViewClicks}{" "}
                      {analyticsSummary.topProduct.activeViewClicks === 1
                        ? "clic"
                        : "clics"}{" "}
                      ({analyticsSummary.topProduct.categoryName})
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-xs text-[#7A8699]">
                  Aún no hay clics registrados en esta vista.
                </p>
              )}
            </div>

            <div className="bg-white rounded-[24px] p-5 border border-[#E2ECF2] shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6C7686]">
                Clics en «Reservar WhatsApp»
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#1D7A46]">
                  {analyticsSummary.totalWa}
                </span>
                <span className="text-xs font-medium text-[#1D7A46]">
                  intenciones de reserva
                </span>
              </div>
              <p className="mt-2 text-xs text-[#6C7686]">
                Clics en el botón de WhatsApp dentro de cada producto.
              </p>
            </div>

            <div className="bg-white rounded-[24px] p-5 border border-[#E2ECF2] shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6C7686]">
                Categoría con Mayor Interés
              </span>
              {analyticsSummary.topCategory ? (
                <div className="mt-2">
                  <p className="text-base font-bold text-[#2D3440]">
                    {analyticsSummary.topCategory.label}
                  </p>
                  <p className="text-xs font-semibold text-[#2B8EAD] mt-1">
                    {analyticsSummary.topCategory.clicks}{" "}
                    {analyticsSummary.topCategory.clicks === 1
                      ? "clic acumulado"
                      : "clics acumulados"}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-xs text-[#7A8699]">
                  Se mostrará en cuanto los visitantes naveguen por el catálogo.
                </p>
              )}
            </div>
          </div>

          {/* Filter & Actions Toolbar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E2ECF2] shadow-sm flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              {/* City Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6C7686] mr-1">
                  Ciudad:
                </span>
                {(
                  [
                    { id: "all", label: "Todas las ciudades" },
                    { id: "lima", label: "📍 Solo Lima" },
                    { id: "arequipa", label: "📍 Solo Arequipa" },
                  ] as const
                ).map((cOpt) => (
                  <button
                    key={cOpt.id}
                    type="button"
                    onClick={() => setClickCityFilter(cOpt.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                      clickCityFilter === cOpt.id
                        ? "bg-[#2B8EAD] text-white shadow-xs"
                        : "bg-[#F2F7FA] text-[#5A6577] hover:bg-[#E5F0F6]"
                    }`}
                  >
                    {cOpt.label}
                  </button>
                ))}
              </div>

              {/* Search + Refresh + Reset */}
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  type="search"
                  value={clickSearchQuery}
                  onChange={(e) => setClickSearchQuery(e.target.value)}
                  placeholder="Buscar inflable..."
                  aria-label="Buscar inflable en estadísticas"
                  className="w-full sm:w-56 h-9 px-3.5 rounded-full border border-[#D7E3EC] bg-[#F9FBFD] text-xs text-[#2D3440] focus:outline-none focus:border-[#5CC2DE] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={fetchClicks}
                  disabled={loadingClicks}
                  className="h-9 px-4 rounded-full border border-[#D7E3EC] bg-[#F7FAFC] hover:bg-[#EBF5FA] text-[#2D3440] text-xs font-semibold transition cursor-pointer"
                >
                  {loadingClicks ? "Actualizando..." : "🔄 Actualizar"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmResetAllClicks(true)}
                  className="h-9 px-4 rounded-full border border-[#F3CCD3] bg-[#FFF5F7] hover:bg-[#FFE6EB] text-[#B4233C] text-xs font-semibold transition cursor-pointer"
                >
                  Reiniciar contadores
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#F0F4F8]">
              <button
                type="button"
                onClick={() => setClickCategoryFilter("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                  clickCategoryFilter === "all"
                    ? "bg-[#2D3440] text-white font-semibold"
                    : "bg-[#F2F7FA] text-[#5A6577] hover:bg-[#E5F0F6]"
                }`}
              >
                Todas las categorías ({clickItems.length})
              </button>
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setClickCategoryFilter(cat.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                    clickCategoryFilter === cat.slug
                      ? "bg-[#2D3440] text-white font-semibold"
                      : "bg-[#F2F7FA] text-[#5A6577] hover:bg-[#E5F0F6]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ranking Table / List */}
          <div className="mt-6 bg-white rounded-3xl border border-[#E2ECF2] shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-[#EBF1F5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-[#FAFCFE]">
              <div>
                <h2 className="text-base font-semibold text-[#2D3440]">
                  Ranking de Inflables Más Clickeados (Ordenado de Mayor a Menor)
                </h2>
                <p className="text-xs text-[#6C7686]">
                  Te permite identificar qué tipo de juegos generan más interés
                  en los visitantes para priorizar futuras adquisiciones.
                </p>
              </div>
              <span className="text-xs font-medium text-[#7A8699]">
                Nota: Los clics hechos mientras tienes sesión abierta en /admin
                no se contabilizan.
              </span>
            </div>

            <div className="divide-y divide-[#EFF4F8]">
              {rankedAnalyticsItems.map((item, idx) => {
                const maxViews = Math.max(
                  1,
                  rankedAnalyticsItems[0]?.activeViewClicks || 1
                )
                const barPercent =
                  item.activeViewClicks > 0
                    ? Math.max(
                        6,
                        Math.round((item.activeViewClicks / maxViews) * 100)
                      )
                    : 0
                const rankBadge =
                  idx === 0 && item.activeViewClicks > 0
                    ? "🥇 1.°"
                    : idx === 1 && item.activeViewClicks > 0
                      ? "🥈 2.°"
                      : idx === 2 && item.activeViewClicks > 0
                        ? "🥉 3.°"
                        : `${idx + 1}.°`

                return (
                  <div
                    key={item.slug}
                    className="px-5 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F9FBFD] transition"
                  >
                    {/* Left: Rank + Image + Title + Progress Bar */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <span
                        className={`w-12 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          idx < 3 && item.activeViewClicks > 0
                            ? "bg-[#EBF5FA] text-[#2B8EAD]"
                            : "bg-[#F2F6FA] text-[#6C7686]"
                        }`}
                      >
                        {rankBadge}
                      </span>

                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="w-12 h-12 rounded-xl object-cover border border-[#E2ECF2] shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-[#2D3440] truncate">
                            {item.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-[#F2F7FA] text-[#5A6577] text-[11px] font-medium">
                            {item.categoryName}
                          </span>
                        </div>

                        {/* Visual Popularity Bar */}
                        <div className="mt-2 w-full max-w-md h-2 rounded-full bg-[#EEF4F8] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#5CC2DE] to-[#2B8EAD] transition-all duration-300"
                            style={{ width: `${barPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right: Metrics Counters + Reset Single */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-5 shrink-0">
                      <div className="px-3.5 py-2 rounded-2xl bg-[#F4F9FC] border border-[#DFECF4] text-center min-w-[110px]">
                        <span className="block text-lg font-bold text-[#2D3440] leading-none">
                          {item.activeViewClicks}
                        </span>
                        <span className="block text-[11px] font-semibold text-[#2B8EAD] mt-1">
                          Clics al Inflable
                        </span>
                      </div>

                      <div className="px-3.5 py-2 rounded-2xl bg-[#F3FAF6] border border-[#D5EFE0] text-center min-w-[115px]">
                        <span className="block text-lg font-bold text-[#1D7A46] leading-none">
                          {item.activeWaClicks}
                        </span>
                        <span className="block text-[11px] font-semibold text-[#1D7A46] mt-1">
                          Clics WhatsApp
                        </span>
                      </div>

                      <div className="text-right text-[11px] text-[#6C7686] min-w-[125px]">
                        <p>
                          <strong>Lima:</strong> {item.viewClicksLima} ·{" "}
                          <strong>AQP:</strong> {item.viewClicksArequipa}
                        </p>
                        <p className="text-[#8A96A8] mt-0.5">
                          {item.lastClickedAt > 0
                            ? `Último: ${new Date(
                                item.lastClickedAt
                              ).toLocaleDateString("es-PE", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}`
                            : "Sin clics aún"}
                        </p>
                      </div>

                      {(item.totalViewClicks > 0 ||
                        item.totalWhatsappClicks > 0) && (
                        <button
                          type="button"
                          onClick={() => handleResetClicks(item.slug)}
                          title="Reiniciar contador de este producto a 0"
                          className="h-8 px-2.5 rounded-full border border-[#D7E3EC] text-[11px] font-semibold text-[#6C7686] hover:bg-[#FFF1F3] hover:text-[#B4233C] hover:border-[#F8C6D0] transition cursor-pointer"
                        >
                          ↺ 0
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Reset All Clicks Modal */}
      {confirmResetAllClicks && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#19202A]/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setConfirmResetAllClicks(false)}
        >
          <div
            className="w-full max-w-[420px] bg-white rounded-[26px] p-6 sm:p-7 shadow-2xl border border-[#E2ECF2] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#2D3440]">
              ¿Reiniciar todos los contadores a 0?
            </h3>
            <p className="text-xs text-[#6C7686] mt-2">
              Esta acción pondrá en cero las estadísticas de clics de todos los
              inflables para iniciar una nueva medición.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmResetAllClicks(false)}
                className="h-10 px-5 rounded-full border border-[#D7E3EC] text-xs font-semibold text-[#5A6577] hover:bg-[#F2F7FA] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={resettingClicks}
                onClick={() => handleResetClicks("all")}
                className="h-10 px-5 rounded-full bg-[#B4233C] hover:bg-[#961B30] text-white text-xs font-semibold transition cursor-pointer"
              >
                {resettingClicks ? "Reiniciando..." : "Sí, reiniciar todo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: CREAR NUEVO PRODUCTO / EDITAR PRODUCTO EXISTENTE
          ==================================================================== */}
      {productModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="da-prod-modal-title"
          className="fixed inset-0 z-50 bg-[#19202A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setProductModalOpen(false)}
        >
          <div
            className="w-full max-w-[720px] max-h-[90dvh] overflow-y-auto bg-white rounded-[28px] p-6 sm:p-8 shadow-2xl border border-[#E2ECF2]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#EBF1F5]">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBF5FA] text-[#2B8EAD] mb-1">
                  {productForm.isEditing
                    ? "Modificar Producto Existente"
                    : "Nuevo Producto del Catálogo"}
                </span>
                <h2
                  id="da-prod-modal-title"
                  className="text-xl sm:text-2xl font-semibold text-[#2D3440]"
                >
                  {productForm.isEditing
                    ? `Editar: ${productForm.title}`
                    : "Agregar Nuevo Producto"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                aria-label="Cerrar ventana"
                className="w-9 h-9 rounded-full bg-[#F0F5F9] text-[#2D3440] text-xl leading-none flex items-center justify-center hover:bg-[#E2ECF2] cursor-pointer"
              >
                ×
              </button>
            </div>

            {productFormError && (
              <div
                role="alert"
                className="mt-4 rounded-xl bg-[#FFF1F3] border border-[#F8C6D0] px-4 py-3 text-xs sm:text-sm text-[#B4233C] font-medium"
              >
                {productFormError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="mt-5 space-y-5">
              {/* 1. Imagen del Producto con énfasis en Medida sugerida y Formato: Webp */}
              <div className="rounded-2xl bg-[#F7FAFC] border border-[#DCE7F0] p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-28 h-28 rounded-2xl bg-white border border-[#E2ECF2] overflow-hidden shrink-0 flex items-center justify-center">
                  {productForm.imagePreviewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={productForm.imagePreviewUrl}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-[#8A96A8] text-center px-2">
                      Sin imagen aún
                    </span>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-sm font-semibold text-[#2D3440]">
                    Fotografía del Producto
                  </h3>
                  <div className="mt-1 text-xs text-[#5A6577] space-y-1">
                    <p>
                      <strong>Medida sugerida:</strong> 1000 × 1000 px (1:1
                      cuadrado)
                    </p>
                    <p className="flex items-center justify-center sm:justify-start gap-1.5">
                      <strong>Formato:</strong>{" "}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#EBF5FA] text-[#2B8EAD] font-bold">
                        Webp
                      </span>
                      <span className="text-[11px] text-[#7A8699]">
                        (conversión automática a Webp al subir)
                      </span>
                    </p>
                  </div>

                  <div className="mt-3">
                    <input
                      id="prod-modal-file"
                      type="file"
                      accept="image/webp,image/jpeg,image/png,image/avif"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const preview = URL.createObjectURL(file)
                          setProductForm((prev) => ({
                            ...prev,
                            imageFile: file,
                            imagePreviewUrl: preview,
                          }))
                        }
                      }}
                    />
                    <label
                      htmlFor="prod-modal-file"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D3440] hover:bg-[#5CC2DE] text-white text-xs font-semibold transition cursor-pointer"
                    >
                      📁 Seleccionar imagen (.webp)
                    </label>
                  </div>
                </div>
              </div>

              {/* 2. Nombre, Categoría y Línea/Colección */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Ej: Castillo Pastel Encantado"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1">
                    Categoría del Catálogo *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => {
                      const nextCat = e.target.value as ProductCategorySlug
                      setProductForm((prev) => ({
                        ...prev,
                        category: nextCat,
                        collectionName:
                          DEFAULT_COLLECTION_BY_CATEGORY[nextCat] ||
                          prev.collectionName,
                      }))
                    }}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440]"
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1">
                    Línea o Colección
                  </label>
                  <input
                    type="text"
                    value={productForm.collectionName}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        collectionName: e.target.value,
                      }))
                    }
                    placeholder="Ej: Línea Dreamy Pastel / White Trend"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440]"
                  />
                </div>
              </div>

              {/* 3. Precio, Medidas y Tiempo de Alquiler */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1">
                    Precio *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="Ej: S/ 450"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1">
                    Medidas completas *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.dimensions}
                    onChange={(e) => {
                      const val = e.target.value
                      const shortTag = val
                        .split("×")
                        .slice(0, 2)
                        .map((s) => s.trim())
                        .join(" × ")
                      setProductForm((prev) => ({
                        ...prev,
                        dimensions: val,
                        cardDimensionTag: shortTag || val,
                      }))
                    }}
                    placeholder="Ej: 5m × 4m × 3.5m"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1">
                    Medida en tarjeta
                  </label>
                  <input
                    type="text"
                    value={productForm.cardDimensionTag}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        cardDimensionTag: e.target.value,
                      }))
                    }
                    placeholder="Ej: 5m × 4m"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1">
                    Tiempo de alquiler *
                  </label>
                  <select
                    value={productForm.rentalDurationTag}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        rentalDurationTag: e.target.value,
                      }))
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440]"
                  >
                    <option value="5 hrs">5 hrs (5 Horas)</option>
                    <option value="3 hrs">3 hrs (3 Horas)</option>
                    <option value="2 hrs">2 hrs (2 Horas)</option>
                    <option value="Por evento">Por evento</option>
                  </select>
                </div>
              </div>

              {/* 4. Edad recomendada, Hora adicional y Etiqueta NUEVO */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-center">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1">
                    Edad / Público
                  </label>
                  <input
                    type="text"
                    value={productForm.ages}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        ages: e.target.value,
                      }))
                    }
                    placeholder="Ej: Niños (hasta 8 años)"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1">
                    Costo hora adicional
                  </label>
                  <input
                    type="text"
                    value={productForm.extraHour}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        extraHour: e.target.value,
                      }))
                    }
                    placeholder="Ej: S/ 70 (opcional)"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440]"
                  />
                </div>

                <div className="pt-4">
                  <label className="inline-flex items-center gap-2.5 text-sm font-medium text-[#2D3440] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={productForm.isNew}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          isNew: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded accent-[#2B8EAD]"
                    />
                    <span>Mostrar insignia «★ NUEVO»</span>
                  </label>
                </div>
              </div>

              {/* 5. Subtítulo corto (para tarjeta) y Descripción completa */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1">
                  Subtítulo corto (se muestra en la tarjeta del catálogo) *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.subtitle}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      subtitle: e.target.value,
                    }))
                  }
                  placeholder="Ej: Castillo pastel con tobogán, área de salto y piscina de pelotas"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1">
                  Descripción completa (se muestra dentro de la página del
                  producto) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe los atractivos principales del inflable o servicio..."
                  className="w-full p-3.5 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1">
                  Beneficios / Puntos destacados (uno por línea)
                </label>
                <textarea
                  rows={3}
                  value={productForm.bulletsText}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      bulletsText: e.target.value,
                    }))
                  }
                  placeholder="5 horas de alquiler con personal de apoyo&#10;Incluye montaje, desmontaje y desinfección"
                  className="w-full p-3.5 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440]"
                />
              </div>

              <div className="pt-3 border-t border-[#EBF1F5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="h-11 px-5 rounded-full border border-[#D7E3EC] text-xs sm:text-sm font-semibold text-[#5A6577] hover:bg-[#F2F7FA] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={productSaving}
                  className="h-11 px-6 rounded-full bg-[#2D3440] hover:bg-[#5CC2DE] text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-md disabled:opacity-60"
                >
                  {productSaving
                    ? "Guardando..."
                    : productForm.isEditing
                      ? "Guardar modificaciones"
                      : "Crear y publicar producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL DE CONFIRMACIÓN PARA ELIMINAR PRODUCTO
          ==================================================================== */}
      {productToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#19202A]/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setProductToDelete(null)}
        >
          <div
            className="w-full max-w-[420px] bg-white rounded-[26px] p-6 sm:p-7 shadow-2xl border border-[#E2ECF2] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#2D3440]">
              ¿Eliminar «{productToDelete.title}»?
            </h3>
            <p className="text-xs text-[#6C7686] mt-2">
              El producto dejará de mostrarse en el catálogo público del sitio
              web.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="h-10 px-5 rounded-full border border-[#D7E3EC] text-xs font-semibold text-[#5A6577] hover:bg-[#F2F7FA] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProduct}
                className="h-10 px-5 rounded-full bg-[#B4233C] hover:bg-[#961B30] text-white text-xs font-semibold transition cursor-pointer"
              >
                Sí, eliminar producto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL DE SEGURIDAD: CAMBIAR USUARIO / CONTRASEÑA
          ==================================================================== */}
      {securityModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="da-sec-modal-title"
          className="fixed inset-0 z-50 bg-[#19202A]/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSecurityModalOpen(false)}
        >
          <div
            className="w-full max-w-[460px] bg-white rounded-[28px] p-7 sm:p-8 shadow-2xl border border-[#E2ECF2]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2
                id="da-sec-modal-title"
                className="text-xl font-semibold text-[#2D3440]"
              >
                Cambiar usuario / contraseña
              </h2>
              <button
                type="button"
                onClick={() => setSecurityModalOpen(false)}
                aria-label="Cerrar ventana"
                className="w-9 h-9 rounded-full bg-[#F0F5F9] text-[#2D3440] text-xl leading-none flex items-center justify-center hover:bg-[#E2ECF2] cursor-pointer"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-[#6C7686] mb-5">
              Por seguridad, debes confirmar tu{" "}
              <strong>contraseña actual</strong> antes de guardar un nuevo
              usuario o contraseña.
            </p>

            {secError && (
              <div
                role="alert"
                className="mb-4 rounded-xl bg-[#FFF1F3] border border-[#F8C6D0] px-3.5 py-2.5 text-xs text-[#B4233C] font-medium"
              >
                {secError}
              </div>
            )}

            {secSuccess && (
              <div
                role="status"
                className="mb-4 rounded-xl bg-[#E6F7ED] border border-[#B5E6C8] px-3.5 py-2.5 text-xs text-[#1D7A46] font-medium"
              >
                {secSuccess}
              </div>
            )}

            <form onSubmit={handleChangeCredentials} className="space-y-3.5">
              <div>
                <label
                  htmlFor="sec-current-pass"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1"
                >
                  Contraseña Actual (Obligatoria)
                </label>
                <input
                  id="sec-current-pass"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440]"
                />
              </div>

              <div>
                <label
                  htmlFor="sec-new-user"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1"
                >
                  Nuevo Usuario
                </label>
                <input
                  id="sec-new-user"
                  type="text"
                  required
                  minLength={3}
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440]"
                />
              </div>

              <div>
                <label
                  htmlFor="sec-new-pass"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1"
                >
                  Nueva Contraseña (mín. 8 caracteres)
                </label>
                <input
                  id="sec-new-pass"
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Escribe la nueva contraseña"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440]"
                />
              </div>

              <div>
                <label
                  htmlFor="sec-confirm-pass"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#5A6577] mb-1"
                >
                  Confirmar Nueva Contraseña
                </label>
                <input
                  id="sec-confirm-pass"
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSecurityModalOpen(false)}
                  className="h-10 px-4 rounded-full border border-[#D7E3EC] text-xs font-semibold text-[#5A6577] hover:bg-[#F2F7FA] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={secLoading}
                  className="h-10 px-5 rounded-full bg-[#2D3440] hover:bg-[#5CC2DE] text-white text-xs font-semibold transition cursor-pointer disabled:opacity-60"
                >
                  {secLoading ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
