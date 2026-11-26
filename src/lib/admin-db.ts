import fs from "fs/promises"
import path from "path"
import mysql from "mysql2/promise"
import {
  DEFAULT_ADMIN_PASSWORD_HASH,
  DEFAULT_ADMIN_USERNAME,
} from "@/lib/admin-auth"
import { EDITABLE_IMAGE_SLOTS } from "@/data/site-images-catalog"
import {
  PACKAGES_DATA,
  PRODUCT_CATEGORIES,
  getPackageBySlug,
  type InflatablePackage,
  type ProductCategorySlug,
} from "@/data/packages"

export interface StoredAdminUser {
  username: string
  passwordHash: string
  updatedAt: string
}

export interface ImageOverrideMeta {
  key: string
  path: string
  mimeType: string
  updatedAt: number
}

export interface ProductChangeRecord {
  slug: string
  action: "upsert" | "delete"
  product?: InflatablePackage
  updatedAt: number
}

export interface ProductClickStats {
  slug: string
  viewClicksLima: number
  viewClicksArequipa: number
  whatsappClicksLima: number
  whatsappClicksArequipa: number
  lastClickedAt: number
}

export interface AdminProductFormInput {
  slug?: string
  title: string
  category: ProductCategorySlug
  collectionName: string
  price: string
  dimensions: string
  cardDimensionTag?: string
  rentalDurationTag: string // e.g. "5 hrs", "3 hrs", "Por evento"
  subtitle: string
  description: string
  ages: string
  extraHour?: string
  isNew?: boolean
  bulletsText?: string // newline-separated bullet strings
  imagePath?: string
}

interface LocalStoreFile {
  adminUser: StoredAdminUser
  overrides: Record<string, ImageOverrideMeta>
  productChanges?: Record<string, ProductChangeRecord>
  productClicks?: Record<string, ProductClickStats>
}

const LOCAL_STORE_PATH = path.join(process.cwd(), "data", "admin-store.json")
const LOCAL_BACKUP_DIR = path.join(process.cwd(), "data", "original-images")

let pool: mysql.Pool | null = null
let schemaInitialized = false

export function isMySqlConfigured(): boolean {
  return Boolean(
    process.env.MYSQL_HOST &&
      process.env.MYSQL_USER &&
      process.env.MYSQL_DATABASE
  )
}

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    })
  }
  return pool
}

async function ensureMySqlSchema(): Promise<boolean> {
  if (!isMySqlConfigured()) return false
  if (schemaInitialized) return true

  try {
    const db = getPool()
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)

    await db.execute(`
      CREATE TABLE IF NOT EXISTS site_images (
        image_key VARCHAR(120) PRIMARY KEY,
        target_path VARCHAR(255) NOT NULL,
        mime_type VARCHAR(60) NOT NULL DEFAULT 'image/webp',
        image_data LONGBLOB NOT NULL,
        updated_at BIGINT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)

    await db.execute(`
      CREATE TABLE IF NOT EXISTS site_products (
        slug VARCHAR(140) PRIMARY KEY,
        action VARCHAR(20) NOT NULL DEFAULT 'upsert',
        product_json LONGTEXT NULL,
        image_mime VARCHAR(60) NULL DEFAULT 'image/webp',
        image_data LONGBLOB NULL,
        updated_at BIGINT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)

    await db.execute(`
      CREATE TABLE IF NOT EXISTS product_clicks (
        slug VARCHAR(140) PRIMARY KEY,
        view_clicks_lima INT NOT NULL DEFAULT 0,
        view_clicks_arequipa INT NOT NULL DEFAULT 0,
        whatsapp_clicks_lima INT NOT NULL DEFAULT 0,
        whatsapp_clicks_arequipa INT NOT NULL DEFAULT 0,
        last_clicked_at BIGINT NOT NULL DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)

    const [rows] = await db.execute<mysql.RowDataPacket[]>(
      "SELECT COUNT(*) AS cnt FROM admin_users"
    )
    const count = Number(rows[0]?.cnt ?? 0)
    if (count === 0) {
      await db.execute(
        "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
        [DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD_HASH]
      )
    }

    schemaInitialized = true
    return true
  } catch (err) {
    console.error("[admin-db] MySQL connection/schema fallback to local:", err)
    return false
  }
}

async function readLocalStore(): Promise<LocalStoreFile> {
  try {
    const raw = await fs.readFile(LOCAL_STORE_PATH, "utf-8")
    const parsed = JSON.parse(raw) as Partial<LocalStoreFile>
    return {
      adminUser: parsed.adminUser ?? {
        username: DEFAULT_ADMIN_USERNAME,
        passwordHash: DEFAULT_ADMIN_PASSWORD_HASH,
        updatedAt: new Date().toISOString(),
      },
      overrides: parsed.overrides ?? {},
      productChanges: parsed.productChanges ?? {},
      productClicks: parsed.productClicks ?? {},
    }
  } catch {
    return {
      adminUser: {
        username: DEFAULT_ADMIN_USERNAME,
        passwordHash: DEFAULT_ADMIN_PASSWORD_HASH,
        updatedAt: new Date().toISOString(),
      },
      overrides: {},
      productChanges: {},
      productClicks: {},
    }
  }
}

async function writeLocalStore(store: LocalStoreFile): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_STORE_PATH), { recursive: true })
  await fs.writeFile(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), "utf-8")
}

export async function getAdminUser(): Promise<{
  username: string
  passwordHash: string
  storageMode: "mysql" | "local"
}> {
  if (await ensureMySqlSchema()) {
    try {
      const db = getPool()
      const [rows] = await db.execute<mysql.RowDataPacket[]>(
        "SELECT username, password_hash FROM admin_users ORDER BY id ASC LIMIT 1"
      )
      if (rows.length > 0) {
        return {
          username: String(rows[0].username),
          passwordHash: String(rows[0].password_hash),
          storageMode: "mysql",
        }
      }
    } catch (err) {
      console.error("[admin-db] Error reading admin_users from MySQL:", err)
    }
  }

  const local = await readLocalStore()
  return {
    username: local.adminUser.username,
    passwordHash: local.adminUser.passwordHash,
    storageMode: "local",
  }
}

export async function updateAdminCredentials(
  newUsername: string,
  newPasswordHash: string
): Promise<"mysql" | "local"> {
  const local = await readLocalStore()
  local.adminUser = {
    username: newUsername,
    passwordHash: newPasswordHash,
    updatedAt: new Date().toISOString(),
  }
  await writeLocalStore(local)

  if (await ensureMySqlSchema()) {
    try {
      const db = getPool()
      await db.execute(
        "UPDATE admin_users SET username = ?, password_hash = ? ORDER BY id ASC LIMIT 1",
        [newUsername, newPasswordHash]
      )
      return "mysql"
    } catch (err) {
      console.error("[admin-db] Error updating MySQL credentials:", err)
    }
  }

  return "local"
}

export async function getImageOverridesMap(): Promise<
  Record<string, ImageOverrideMeta>
> {
  if (await ensureMySqlSchema()) {
    try {
      const db = getPool()
      const [rows] = await db.execute<mysql.RowDataPacket[]>(
        "SELECT image_key, target_path, mime_type, updated_at FROM site_images"
      )
      const map: Record<string, ImageOverrideMeta> = {}
      for (const r of rows) {
        map[String(r.image_key)] = {
          key: String(r.image_key),
          path: String(r.target_path),
          mimeType: String(r.mime_type || "image/webp"),
          updatedAt: Number(r.updated_at),
        }
      }
      return map
    } catch (err) {
      console.error("[admin-db] Error reading site_images from MySQL:", err)
    }
  }

  const local = await readLocalStore()
  return local.overrides
}

export async function saveUploadedSlotImage(
  slotKey: string,
  buffer: Buffer,
  mimeType: string
): Promise<ImageOverrideMeta> {
  const slot = EDITABLE_IMAGE_SLOTS.find((s) => s.key === slotKey)
  if (!slot) {
    throw new Error(`Slot de imagen no encontrado: ${slotKey}`)
  }

  const now = Date.now()
  const publicFilePath = path.join(
    process.cwd(),
    "public",
    ...slot.path.replace(/^\//, "").split("/")
  )
  const backupFilePath = path.join(LOCAL_BACKUP_DIR, `${slot.key}.webp`)

  // 1. Back up original file once if not already backed up
  try {
    await fs.mkdir(LOCAL_BACKUP_DIR, { recursive: true })
    try {
      await fs.access(backupFilePath)
    } catch {
      const origBytes = await fs.readFile(publicFilePath)
      await fs.writeFile(backupFilePath, origBytes)
    }
  } catch {
    // Non-fatal if original doesn't exist
  }

  // 2. Write new image to public/images/... on disk so static file is updated immediately
  try {
    await fs.mkdir(path.dirname(publicFilePath), { recursive: true })
    await fs.writeFile(publicFilePath, buffer)
  } catch (err) {
    console.warn("[admin-db] Could not write to public folder directly:", err)
  }

  const meta: ImageOverrideMeta = {
    key: slot.key,
    path: slot.path,
    mimeType,
    updatedAt: now,
  }

  // 3. Save in local store metadata
  const local = await readLocalStore()
  local.overrides[slot.key] = meta
  await writeLocalStore(local)

  // 4. Save binary LONGBLOB + metadata in MySQL if configured
  if (await ensureMySqlSchema()) {
    try {
      const db = getPool()
      await db.execute(
        `INSERT INTO site_images (image_key, target_path, mime_type, image_data, updated_at)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           target_path = VALUES(target_path),
           mime_type = VALUES(mime_type),
           image_data = VALUES(image_data),
           updated_at = VALUES(updated_at)`,
        [slot.key, slot.path, mimeType, buffer, now]
      )
    } catch (err) {
      console.error("[admin-db] Error saving image LONGBLOB to MySQL:", err)
    }
  }

  return meta
}

export async function restoreOriginalSlotImage(slotKey: string): Promise<void> {
  const slot = EDITABLE_IMAGE_SLOTS.find((s) => s.key === slotKey)
  if (!slot) {
    throw new Error(`Slot de imagen no encontrado: ${slotKey}`)
  }

  const publicFilePath = path.join(
    process.cwd(),
    "public",
    ...slot.path.replace(/^\//, "").split("/")
  )
  const backupFilePath = path.join(LOCAL_BACKUP_DIR, `${slot.key}.webp`)

  try {
    const origBytes = await fs.readFile(backupFilePath)
    await fs.writeFile(publicFilePath, origBytes)
  } catch {
    // No local backup needed if never overwritten on disk
  }

  const local = await readLocalStore()
  delete local.overrides[slot.key]
  await writeLocalStore(local)

  if (await ensureMySqlSchema()) {
    try {
      const db = getPool()
      await db.execute("DELETE FROM site_images WHERE image_key = ?", [
        slot.key,
      ])
    } catch (err) {
      console.error("[admin-db] Error deleting override from MySQL:", err)
    }
  }
}

export async function getSlotImageBinary(
  slotKey: string
): Promise<{ buffer: Buffer; mimeType: string } | null> {
  // Support custom product image keys: prod-img-<slug>
  if (slotKey.startsWith("prod-img-")) {
    const prodSlug = slotKey.replace("prod-img-", "")
    if (await ensureMySqlSchema()) {
      try {
        const db = getPool()
        const [rows] = await db.execute<mysql.RowDataPacket[]>(
          "SELECT image_mime, image_data FROM site_products WHERE slug = ? LIMIT 1",
          [prodSlug]
        )
        if (rows.length > 0 && rows[0].image_data) {
          return {
            buffer: Buffer.isBuffer(rows[0].image_data)
              ? rows[0].image_data
              : Buffer.from(rows[0].image_data),
            mimeType: String(rows[0].image_mime || "image/webp"),
          }
        }
      } catch (err) {
        console.error("[admin-db] Error reading product binary from MySQL:", err)
      }
    }
    try {
      const diskPath = path.join(
        process.cwd(),
        "public",
        "images",
        "catalogo",
        `${prodSlug}.webp`
      )
      const buffer = await fs.readFile(diskPath)
      return { buffer, mimeType: "image/webp" }
    } catch {
      return null
    }
  }

  const slot = EDITABLE_IMAGE_SLOTS.find((s) => s.key === slotKey)
  if (!slot) return null

  if (await ensureMySqlSchema()) {
    try {
      const db = getPool()
      const [rows] = await db.execute<mysql.RowDataPacket[]>(
        "SELECT mime_type, image_data FROM site_images WHERE image_key = ? LIMIT 1",
        [slotKey]
      )
      if (rows.length > 0 && rows[0].image_data) {
        return {
          buffer: Buffer.isBuffer(rows[0].image_data)
            ? rows[0].image_data
            : Buffer.from(rows[0].image_data),
          mimeType: String(rows[0].mime_type || "image/webp"),
        }
      }
    } catch (err) {
      console.error("[admin-db] Error fetching binary from MySQL:", err)
    }
  }

  try {
    const publicFilePath = path.join(
      process.cwd(),
      "public",
      ...slot.path.replace(/^\//, "").split("/")
    )
    const buffer = await fs.readFile(publicFilePath)
    return { buffer, mimeType: "image/webp" }
  } catch {
    return null
  }
}

// ============================================================================
// PRODUCT CATALOG CRUD (CREATE, EDIT/MODIFY, DELETE, RESTORE)
// ============================================================================

export function slugifyProductTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function formatPriceString(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return "S/ 300"
  if (trimmed.toUpperCase().startsWith("S/")) return trimmed
  return `S/ ${trimmed}`
}

export function buildCompleteProductPackage(
  input: AdminProductFormInput,
  existing?: InflatablePackage
): InflatablePackage {
  const slug = (input.slug?.trim() || slugifyProductTitle(input.title)) || `producto-${Date.now()}`
  const catInfo =
    PRODUCT_CATEGORIES.find((c) => c.slug === input.category) ??
    PRODUCT_CATEGORIES[0]
  const fallbackTemplate = existing ?? PACKAGES_DATA[0]

  const cleanPrice = formatPriceString(input.price)
  const cleanDims = input.dimensions.trim() || "4m × 4m × 3m"
  const shortDim =
    input.cardDimensionTag?.trim() ||
    cleanDims.split("×").slice(0, 2).map((s) => s.trim()).join(" × ") ||
    cleanDims

  const durationTag = input.rentalDurationTag.trim() || "5 hrs"
  const durationPill =
    durationTag === "3 hrs"
      ? "3 Horas"
      : durationTag === "2 hrs"
        ? "2 Horas"
        : durationTag.toLowerCase().includes("evento")
          ? "Por Evento"
          : "5 Horas"
  const durationFull =
    durationPill === "Por Evento"
      ? "Por todo el evento"
      : `${durationPill.toLowerCase()} por evento`

  const rawBullets = (input.bulletsText ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const emojis = ["✨", "🏰", "🛡️", "🎉", "⏱️"]
  const featureBullets =
    rawBullets.length > 0
      ? rawBullets.map((text, idx) => ({
          emoji: existing?.featureBullets[idx]?.emoji ?? emojis[idx % emojis.length],
          text,
        }))
      : existing?.featureBullets ?? [
          { emoji: "✨", text: `${durationPill} de alquiler con personal de apoyo` },
          { emoji: "🏰", text: `Medidas del equipo: ${cleanDims}` },
          { emoji: "🛡️", text: "Incluye montaje, desmontaje y desinfección certificada" },
        ]

  const imagePath =
    input.imagePath?.trim() ||
    existing?.image ||
    `/images/catalogo/${slug}.webp`

  const imagesList =
    existing && existing.image === imagePath && existing.images.length > 0
      ? existing.images
      : [imagePath]

  const extraHourVal = input.extraHour?.trim() || ""

  const tableSpecs = [
    { label: "Categoría", value: catInfo.label },
    { label: "Línea / Colección", value: input.collectionName.trim() || catInfo.label },
    { label: "Medidas / Formato", value: cleanDims },
    { label: "Tiempo de alquiler", value: durationFull },
    { label: "Edad / Público", value: input.ages.trim() || "Todas las edades" },
    { label: "Movilidad referencial", value: "S/ 30 (sujeto a ubicación)" },
    ...(extraHourVal ? [{ label: "Hora adicional", value: formatPriceString(extraHourVal) }] : []),
  ]

  const sizeOptions =
    existing && existing.sizeOptions.length > 1
      ? existing.sizeOptions.map((opt, idx) =>
          idx === 0 ? { ...opt, label: shortDim, price: cleanPrice } : opt
        )
      : [
          {
            id: `${slug}-std`,
            label: shortDim,
            price: cleanPrice,
            isDefault: true,
          },
        ]

  return {
    ...fallbackTemplate,
    slug,
    modelKey: slug,
    category: input.category,
    categoryName: catInfo.label,
    collectionName: input.collectionName.trim() || catInfo.label,
    tierName: catInfo.label,
    title: input.title.trim(),
    subtitle: input.subtitle.trim() || input.description.trim().slice(0, 95),
    shortDescription: input.description.trim() || input.subtitle.trim(),
    fullDescription: input.description.trim() || input.subtitle.trim(),
    image: imagePath,
    images: imagesList,
    isNew: Boolean(input.isNew),
    price: cleanPrice,
    variantLabel: existing?.variantLabel ?? "Medida",
    rentalDurationPill: durationPill,
    sizeOptions,
    cardTagsLabel: existing?.cardTagsLabel ?? "Medidas",
    cardTags: [shortDim, durationTag],
    featureBullets,
    detailsHeading: {
      line1: `${input.title.trim()}.`,
      line2: "Diversión segura y garantizada.",
    },
    detailsIntro: input.description.trim() || input.subtitle.trim(),
    tableSpecs,
    specs: {
      minSpace: cleanDims,
      heightClearance: cleanDims,
      recommendedAges: input.ages.trim() || "Todas las edades",
      simultaneousCapacity: input.ages.trim() || "Todas las edades",
      durationHours: durationFull,
      powerRequirement: "1 punto de luz 220V cercano",
      setupAdvanceTime: "Instalación anticipada incluida",
    },
    preliminaryHighlights: featureBullets.slice(0, 3).map((b) => b.text),
  }
}

export async function getProductChangesMap(): Promise<
  Record<string, ProductChangeRecord>
> {
  if (await ensureMySqlSchema()) {
    try {
      const db = getPool()
      const [rows] = await db.execute<mysql.RowDataPacket[]>(
        "SELECT slug, action, product_json, updated_at FROM site_products ORDER BY updated_at ASC"
      )
      const map: Record<string, ProductChangeRecord> = {}
      for (const r of rows) {
        const slug = String(r.slug)
        const action = String(r.action) === "delete" ? "delete" : "upsert"
        let product: InflatablePackage | undefined
        if (r.product_json) {
          try {
            product = JSON.parse(String(r.product_json)) as InflatablePackage
          } catch {
            // Ignore malformed JSON
          }
        }
        map[slug] = {
          slug,
          action,
          product,
          updatedAt: Number(r.updated_at),
        }
      }
      return map
    } catch (err) {
      console.error("[admin-db] Error reading site_products from MySQL:", err)
    }
  }

  const local = await readLocalStore()
  return local.productChanges ?? {}
}

export async function getEffectiveCatalogPackages(): Promise<{
  products: InflatablePackage[]
  deletedSlugs: string[]
  customSlugs: string[]
  modifiedSlugs: string[]
}> {
  const changes = await getProductChangesMap()
  const imageOverrides = await getImageOverridesMap()

  const baseSlugs = new Set(PACKAGES_DATA.map((p) => p.slug))
  const deletedSlugs: string[] = []
  const customSlugs: string[] = []
  const modifiedSlugs: string[] = []

  const applySlotImageOverrides = (pkg: InflatablePackage): InflatablePackage => {
    let mainImg = pkg.image
    const updatedImages = (pkg.images ?? [pkg.image]).map((imgPath) => {
      const matchingSlot = EDITABLE_IMAGE_SLOTS.find((s) => s.path === imgPath)
      if (matchingSlot && imageOverrides[matchingSlot.key]) {
        const ov = imageOverrides[matchingSlot.key]
        const url = `/api/media/${matchingSlot.key}?v=${ov.updatedAt}`
        if (imgPath === pkg.image) mainImg = url
        return url
      }
      return imgPath
    })
    return {
      ...pkg,
      image: mainImg,
      images: updatedImages,
    }
  }

  const result: InflatablePackage[] = []

  // 1. Existing base products (modified or untouched, unless deleted)
  for (const basePkg of PACKAGES_DATA) {
    const ch = changes[basePkg.slug]
    if (ch?.action === "delete") {
      deletedSlugs.push(basePkg.slug)
      continue
    }
    if (ch?.action === "upsert" && ch.product) {
      modifiedSlugs.push(basePkg.slug)
      result.push(applySlotImageOverrides(ch.product))
    } else {
      result.push(applySlotImageOverrides(basePkg))
    }
  }

  // 2. Newly created custom products
  for (const [slug, ch] of Object.entries(changes)) {
    if (!baseSlugs.has(slug) && ch.action === "upsert" && ch.product) {
      customSlugs.push(slug)
      result.push(ch.product)
    }
  }

  return {
    products: result,
    deletedSlugs,
    customSlugs,
    modifiedSlugs,
  }
}

export async function getEffectivePackageBySlug(
  slug: string
): Promise<InflatablePackage | undefined> {
  const { products, deletedSlugs } = await getEffectiveCatalogPackages()
  const direct = products.find((p) => p.slug === slug)
  if (direct) return direct

  // Check legacy aliases if not explicitly deleted
  const baseFallback = getPackageBySlug(slug)
  if (baseFallback && !deletedSlugs.includes(baseFallback.slug)) {
    return products.find((p) => p.slug === baseFallback.slug) ?? baseFallback
  }
  return undefined
}

export async function saveCatalogProduct(
  input: AdminProductFormInput,
  imageBuffer?: Buffer | null,
  imageMime?: string
): Promise<InflatablePackage> {
  const targetSlug =
    (input.slug?.trim() || slugifyProductTitle(input.title)) ||
    `producto-${Date.now()}`

  const existingBase = PACKAGES_DATA.find((p) => p.slug === targetSlug)
  const currentChanges = await getProductChangesMap()
  const existingCurrent =
    currentChanges[targetSlug]?.product ?? existingBase

  const now = Date.now()
  let finalImagePath = input.imagePath?.trim() || existingCurrent?.image || "/images/catalogo/arcoiris-magico.webp"

  if (imageBuffer && imageBuffer.length > 0) {
    const diskPath = path.join(
      process.cwd(),
      "public",
      "images",
      "catalogo",
      `${targetSlug}.webp`
    )
    try {
      await fs.mkdir(path.dirname(diskPath), { recursive: true })
      await fs.writeFile(diskPath, imageBuffer)
    } catch (err) {
      console.warn("[admin-db] Could not write product image to public/:", err)
    }
    finalImagePath = `/api/media/prod-img-${targetSlug}?v=${now}`
  }

  const productObj = buildCompleteProductPackage(
    {
      ...input,
      slug: targetSlug,
      imagePath: finalImagePath,
    },
    existingCurrent
  )

  // Save in local store
  const local = await readLocalStore()
  local.productChanges = local.productChanges ?? {}
  local.productChanges[targetSlug] = {
    slug: targetSlug,
    action: "upsert",
    product: productObj,
    updatedAt: now,
  }
  await writeLocalStore(local)

  // Save in MySQL if configured
  if (await ensureMySqlSchema()) {
    try {
      const db = getPool()
      if (imageBuffer && imageBuffer.length > 0) {
        await db.execute(
          `INSERT INTO site_products (slug, action, product_json, image_mime, image_data, updated_at)
           VALUES (?, 'upsert', ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             action = 'upsert',
             product_json = VALUES(product_json),
             image_mime = VALUES(image_mime),
             image_data = VALUES(image_data),
             updated_at = VALUES(updated_at)`,
          [
            targetSlug,
            JSON.stringify(productObj),
            imageMime || "image/webp",
            imageBuffer,
            now,
          ]
        )
      } else {
        await db.execute(
          `INSERT INTO site_products (slug, action, product_json, updated_at)
           VALUES (?, 'upsert', ?, ?)
           ON DUPLICATE KEY UPDATE
             action = 'upsert',
             product_json = VALUES(product_json),
             updated_at = VALUES(updated_at)`,
          [targetSlug, JSON.stringify(productObj), now]
        )
      }
    } catch (err) {
      console.error("[admin-db] Error saving product to MySQL:", err)
    }
  }

  return productObj
}

export async function deleteCatalogProduct(slug: string): Promise<void> {
  const now = Date.now()
  const isBaseProduct = PACKAGES_DATA.some((p) => p.slug === slug)

  const local = await readLocalStore()
  local.productChanges = local.productChanges ?? {}
  if (isBaseProduct) {
    local.productChanges[slug] = {
      slug,
      action: "delete",
      updatedAt: now,
    }
  } else {
    delete local.productChanges[slug]
  }
  await writeLocalStore(local)

  if (await ensureMySqlSchema()) {
    try {
      const db = getPool()
      if (isBaseProduct) {
        await db.execute(
          `INSERT INTO site_products (slug, action, product_json, updated_at)
           VALUES (?, 'delete', NULL, ?)
           ON DUPLICATE KEY UPDATE
             action = 'delete',
             product_json = NULL,
             updated_at = VALUES(updated_at)`,
          [slug, now]
        )
      } else {
        await db.execute("DELETE FROM site_products WHERE slug = ?", [slug])
      }
    } catch (err) {
      console.error("[admin-db] Error deleting product from MySQL:", err)
    }
  }
}

export async function restoreBaseCatalogProduct(slug: string): Promise<void> {
  const local = await readLocalStore()
  if (local.productChanges) {
    delete local.productChanges[slug]
    await writeLocalStore(local)
  }

  if (await ensureMySqlSchema()) {
    try {
      const db = getPool()
      await db.execute("DELETE FROM site_products WHERE slug = ?", [slug])
    } catch (err) {
      console.error("[admin-db] Error restoring base product in MySQL:", err)
    }
  }
}

// ============================================================================
// PRODUCT CLICKS ANALYTICS (TRACKING, RANKING & RESET)
// ============================================================================

export async function recordProductClick(
  slug: string,
  clickType: "view" | "whatsapp" = "view",
  city: "lima" | "arequipa" = "lima"
): Promise<void> {
  const cleanSlug = slug.trim()
  if (!cleanSlug) return
  const now = Date.now()

  // 1. Update local store
  const local = await readLocalStore()
  local.productClicks = local.productClicks ?? {}
  const prev = local.productClicks[cleanSlug] ?? {
    slug: cleanSlug,
    viewClicksLima: 0,
    viewClicksArequipa: 0,
    whatsappClicksLima: 0,
    whatsappClicksArequipa: 0,
    lastClickedAt: 0,
  }

  if (clickType === "whatsapp") {
    if (city === "arequipa") {
      prev.whatsappClicksArequipa += 1
    } else {
      prev.whatsappClicksLima += 1
    }
  } else {
    if (city === "arequipa") {
      prev.viewClicksArequipa += 1
    } else {
      prev.viewClicksLima += 1
    }
  }
  prev.lastClickedAt = now
  local.productClicks[cleanSlug] = prev
  await writeLocalStore(local)

  // 2. Update MySQL if configured
  if (await ensureMySqlSchema()) {
    try {
      const db = getPool()
      const vLima = clickType === "view" && city === "lima" ? 1 : 0
      const vAqp = clickType === "view" && city === "arequipa" ? 1 : 0
      const wLima = clickType === "whatsapp" && city === "lima" ? 1 : 0
      const wAqp = clickType === "whatsapp" && city === "arequipa" ? 1 : 0

      await db.execute(
        `INSERT INTO product_clicks (
           slug, view_clicks_lima, view_clicks_arequipa, whatsapp_clicks_lima, whatsapp_clicks_arequipa, last_clicked_at
         ) VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           view_clicks_lima = view_clicks_lima + VALUES(view_clicks_lima),
           view_clicks_arequipa = view_clicks_arequipa + VALUES(view_clicks_arequipa),
           whatsapp_clicks_lima = whatsapp_clicks_lima + VALUES(whatsapp_clicks_lima),
           whatsapp_clicks_arequipa = whatsapp_clicks_arequipa + VALUES(whatsapp_clicks_arequipa),
           last_clicked_at = VALUES(last_clicked_at)`,
        [cleanSlug, vLima, vAqp, wLima, wAqp, now]
      )
    } catch (err) {
      console.error("[admin-db] Error recording product click in MySQL:", err)
    }
  }
}

export async function getProductClicksMap(): Promise<
  Record<string, ProductClickStats>
> {
  if (await ensureMySqlSchema()) {
    try {
      const db = getPool()
      const [rows] = await db.execute<mysql.RowDataPacket[]>(
        `SELECT slug, view_clicks_lima, view_clicks_arequipa, whatsapp_clicks_lima, whatsapp_clicks_arequipa, last_clicked_at
         FROM product_clicks`
      )
      const map: Record<string, ProductClickStats> = {}
      for (const r of rows) {
        const s = String(r.slug)
        map[s] = {
          slug: s,
          viewClicksLima: Number(r.view_clicks_lima ?? 0),
          viewClicksArequipa: Number(r.view_clicks_arequipa ?? 0),
          whatsappClicksLima: Number(r.whatsapp_clicks_lima ?? 0),
          whatsappClicksArequipa: Number(r.whatsapp_clicks_arequipa ?? 0),
          lastClickedAt: Number(r.last_clicked_at ?? 0),
        }
      }
      return map
    } catch (err) {
      console.error("[admin-db] Error reading product_clicks from MySQL:", err)
    }
  }

  const local = await readLocalStore()
  return local.productClicks ?? {}
}

export async function resetProductClicks(slug?: string): Promise<void> {
  const local = await readLocalStore()
  local.productClicks = local.productClicks ?? {}
  if (!slug || slug === "all") {
    local.productClicks = {}
  } else {
    delete local.productClicks[slug]
  }
  await writeLocalStore(local)

  if (await ensureMySqlSchema()) {
    try {
      const db = getPool()
      if (!slug || slug === "all") {
        await db.execute("DELETE FROM product_clicks")
      } else {
        await db.execute("DELETE FROM product_clicks WHERE slug = ?", [slug])
      }
    } catch (err) {
      console.error("[admin-db] Error resetting product_clicks in MySQL:", err)
    }
  }
}
