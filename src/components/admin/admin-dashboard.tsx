"use client"

import React, { FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ADMIN_IMAGE_SECTIONS,
  type AdminImageSection,
  type EditableImageSlot,
} from "@/data/site-images-catalog"

interface EnrichedSlot extends EditableImageSlot {
  isOverridden: boolean
  updatedAt: number | null
  previewUrl: string
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
        if (res.status === 401) {
          setAuthenticated(false)
        }
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
          await fetchSlots()
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
  }, [fetchSlots])

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
      await fetchSlots()
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
      showToast("ok", `Imagen actualizada: ${slot.title}`)
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
      showToast("ok", `Imagen restaurada a su versión original: ${slot.title}`)
    } catch {
      showToast("err", "Error de red al restaurar la imagen.")
    } finally {
      setBusySlotKey(null)
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

  const overriddenCount = useMemo(
    () => slots.filter((s) => s.isOverridden).length,
    [slots]
  )

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
              Ingresa tus credenciales para gestionar las imágenes de Diamante
              Azul.
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
                Panel de Imágenes · Diamante Azul
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
              Gestor de Imágenes del Sitio Web
            </h1>
            <p className="text-sm text-[#6C7686] mt-0.5">
              Sesión iniciada como <strong>{activeUsername}</strong> ·{" "}
              {slots.length} imágenes registradas ({overriddenCount}{" "}
              {overriddenCount === 1 ? "modificada" : "modificadas"}). Toda foto
              que subas se optimiza automáticamente a formato{" "}
              <strong>.webp</strong>.
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
      </div>

      {/* Filters & Search Toolbar */}
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
              placeholder="Buscar producto o sección..."
              aria-label="Buscar imagen por nombre"
              className="w-full h-10 pl-4 pr-9 rounded-full border border-[#D7E3EC] bg-[#F9FBFD] text-sm text-[#2D3440] focus:outline-none focus:border-[#5CC2DE] focus:bg-white"
            />
          </div>
        </div>

        {/* Grid of Editable Image Cards */}
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
                    {/* Image Preview Box */}
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

                    {/* Slot Metadata */}
                    <div className="p-4">
                      <h2 className="text-base font-semibold text-[#2D3440] leading-snug">
                        {slot.title}
                      </h2>
                      <p className="text-xs text-[#6C7686] mt-1 line-clamp-2">
                        {slot.subtitle}
                      </p>
                      <div className="mt-3 pt-2.5 border-t border-[#F0F4F8] text-[11px] text-[#7A8699] space-y-0.5">
                        <p>
                          <strong>Medida sugerida:</strong>{" "}
                          {slot.recommendedSize}
                        </p>
                        <p className="truncate" title={slot.path}>
                          <strong>Ruta:</strong> {slot.path}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
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

      {/* Security Modal: Change Username / Password */}
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
