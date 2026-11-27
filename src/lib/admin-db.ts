import fs from "fs/promises"
import os from "os"
import path from "path"
import zlib from "zlib"
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
  imageRestoredAt?: Record<string, number>
  productChanges?: Record<string, ProductChangeRecord>
  productRestoredAt?: Record<string, number>
  productClicks?: Record<string, ProductClickStats>
  clicksResetAt?: number
  slugResetAt?: Record<string, number>
}

interface CompactClicksCloudPayload {
  r: number // global clicksResetAt
  s: Record<string, number> // per-slug resetAt
  c: Record<string, [number, number, number, number, number]> // slug -> [vL, vA, wL, wA, ts]
}

const IS_READONLY_SERVERLESS = Boolean(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
)

const LOCAL_STORE_PATH = IS_READONLY_SERVERLESS
  ? path.join(os.tmpdir(), "da-admin-store.json")
  : path.join(process.cwd(), "data", "admin-store.json")

const LOCAL_BACKUP_DIR = IS_READONLY_SERVERLESS
  ? path.join(os.tmpdir(), "da-original-images")
  : path.join(process.cwd(), "data", "original-images")

// Shared Cloud KV Persistence for Serverless environments (Vercel preview when MySQL is not connected yet)
const CLOUD_KV_BASE = "https://keyvalue.immanuel.co/api/KeyVal"
const CLOUD_KV_APP_KEY = "wd4008cg"
const CLOUD_CLICKS_KEYS = ["da_k0", "da_k1", "da_k2", "da_k3", "da_k4", "da_k5"]
const CLOUD_ADMIN_KEYS = [
  "da_a0",
  "da_a1",
  "da_a2",
  "da_a3",
  "da_a4",
  "da_a5",
  "da_a6",
  "da_a7",
  "da_a8",
  "da_a9",
  "da_a10",
  "da_a11",
  "da_a12",
  "da_a13",
  "da_a14",
  "da_a15",
]
const CLOUD_CHUNK_LEN = 175

const globalForStore = globalThis as unknown as {
  __daLocalStoreCache?: LocalStoreFile
  __daLastCloudAdminSync?: number
  __daLastCloudClicksSync?: number
  __daClicksQueue?: Promise<void>
}

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

function createDefaultStore(): LocalStoreFile {
  return {
    adminUser: {
      username: DEFAULT_ADMIN_USERNAME,
      passwordHash: DEFAULT_ADMIN_PASSWORD_HASH,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    overrides: {},
    imageRestoredAt: {},
    productChanges: {},
    productRestoredAt: {},
    productClicks: {},
    clicksResetAt: 0,
    slugResetAt: {},
  }
}

async function saveCompressedToCloudKeys(
  keys: string[],
  payloadObj: unknown
): Promise<void> {
  if (!IS_READONLY_SERVERLESS || isMySqlConfigured()) return
  try {
    const comp = zlib
      .deflateRawSync(Buffer.from(JSON.stringify(payloadObj)))
      .toString("base64url")
    const chunks = keys.map(
      (_, i) =>
        comp.slice(i * CLOUD_CHUNK_LEN, (i + 1) * CLOUD_CHUNK_LEN) || "_"
    )
    await Promise.all(
      keys.map((k, i) =>
        fetch(
          `${CLOUD_KV_BASE}/UpdateValue/${CLOUD_KV_APP_KEY}/${k}/${chunks[i]}`,
          { method: "POST", cache: "no-store" }
        )
      )
    )
  } catch (err) {
    console.warn("[admin-db] Cloud KV save warning:", err)
  }
}

async function loadCompressedFromCloudKeys<T>(keys: string[]): Promise<T | null> {
  if (!IS_READONLY_SERVERLESS || isMySqlConfigured()) return null
  try {
    const parts = await Promise.all(
      keys.map(async (k) => {
        const res = await fetch(
          `${CLOUD_KV_BASE}/GetValue/${CLOUD_KV_APP_KEY}/${k}`,
          { cache: "no-store" }
        )
        if (!res.ok) return ""
        const val = (await res.json()) as string | null
        return val && val !== "_" ? String(val) : ""
      })
    )
    const comp = parts.join("")
    if (!comp) return null
    const raw = zlib
      .inflateRawSync(Buffer.from(comp, "base64url"))
      .toString("utf8")
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function mergeAdminState(
  base: LocalStoreFile,
  incoming: Partial<LocalStoreFile> | null
): LocalStoreFile {
  if (!incoming) return base

  // 1. Merge adminUser by timestamp
  const baseUserTs = Date.parse(base.adminUser?.updatedAt || "2026-01-01T00:00:00.000Z") || 0
  const incUserTs = Date.parse(incoming.adminUser?.updatedAt || "2026-01-01T00:00:00.000Z") || 0
  const adminUser =
    incUserTs > baseUserTs && incoming.adminUser
      ? incoming.adminUser
      : base.adminUser

  // 2. Merge imageRestoredAt & overrides
  const imageRestoredAt: Record<string, number> = {
    ...(base.imageRestoredAt ?? {}),
  }
  for (const [k, ts] of Object.entries(incoming.imageRestoredAt ?? {})) {
    imageRestoredAt[k] = Math.max(imageRestoredAt[k] ?? 0, Number(ts) || 0)
  }

  const overrides: Record<string, ImageOverrideMeta> = {}
  const allOverrideKeys = new Set([
    ...Object.keys(base.overrides ?? {}),
    ...Object.keys(incoming.overrides ?? {}),
  ])
  for (const k of allOverrideKeys) {
    const bOv = base.overrides?.[k]
    const iOv = incoming.overrides?.[k]
    const best =
      bOv && iOv
        ? iOv.updatedAt >= bOv.updatedAt
          ? iOv
          : bOv
        : iOv ?? bOv
    if (best && best.updatedAt > (imageRestoredAt[k] ?? 0)) {
      overrides[k] = best
    }
  }

  // 3. Merge productRestoredAt & productChanges
  const productRestoredAt: Record<string, number> = {
    ...(base.productRestoredAt ?? {}),
  }
  for (const [slug, ts] of Object.entries(incoming.productRestoredAt ?? {})) {
    productRestoredAt[slug] = Math.max(
      productRestoredAt[slug] ?? 0,
      Number(ts) || 0
    )
  }

  const productChanges: Record<string, ProductChangeRecord> = {}
  const allProdSlugs = new Set([
    ...Object.keys(base.productChanges ?? {}),
    ...Object.keys(incoming.productChanges ?? {}),
  ])
  for (const slug of allProdSlugs) {
    const bCh = base.productChanges?.[slug]
    const iCh = incoming.productChanges?.[slug]
    const best =
      bCh && iCh
        ? iCh.updatedAt >= bCh.updatedAt
          ? iCh
          : bCh
        : iCh ?? bCh
    if (best && best.updatedAt > (productRestoredAt[slug] ?? 0)) {
      productChanges[slug] = best
    }
  }

  // 4. Merge clicks & resets
  const clicksResetAt = Math.max(
    base.clicksResetAt ?? 0,
    incoming.clicksResetAt ?? 0
  )
  const slugResetAt: Record<string, number> = { ...(base.slugResetAt ?? {}) }
  for (const [slug, ts] of Object.entries(incoming.slugResetAt ?? {})) {
    slugResetAt[slug] = Math.max(slugResetAt[slug] ?? 0, Number(ts) || 0)
  }

  const productClicks: Record<string, ProductClickStats> = {}
  const allClickSlugs = new Set([
    ...Object.keys(base.productClicks ?? {}),
    ...Object.keys(incoming.productClicks ?? {}),
  ])
  for (const slug of allClickSlugs) {
    const effectiveReset = Math.max(clicksResetAt, slugResetAt[slug] ?? 0)
    const bClk =
      base.productClicks?.[slug] &&
      base.productClicks[slug].lastClickedAt > effectiveReset
        ? base.productClicks[slug]
        : null
    const iClk =
      incoming.productClicks?.[slug] &&
      incoming.productClicks[slug].lastClickedAt > effectiveReset
        ? incoming.productClicks[slug]
        : null
    if (!bClk && !iClk) continue
    productClicks[slug] = {
      slug,
      viewClicksLima: Math.max(bClk?.viewClicksLima ?? 0, iClk?.viewClicksLima ?? 0),
      viewClicksArequipa: Math.max(
        bClk?.viewClicksArequipa ?? 0,
        iClk?.viewClicksArequipa ?? 0
      ),
      whatsappClicksLima: Math.max(
        bClk?.whatsappClicksLima ?? 0,
        iClk?.whatsappClicksLima ?? 0
      ),
      whatsappClicksArequipa: Math.max(
        bClk?.whatsappClicksArequipa ?? 0,
        iClk?.whatsappClicksArequipa ?? 0
      ),
      lastClickedAt: Math.max(bClk?.lastClickedAt ?? 0, iClk?.lastClickedAt ?? 0),
    }
  }

  return {
    adminUser,
    overrides,
    imageRestoredAt,
    productChanges,
    productRestoredAt,
    productClicks,
    clicksResetAt,
    slugResetAt,
  }
}

async function readDiskOrMemoryStore(): Promise<LocalStoreFile> {
  try {
    const raw = await fs.readFile(LOCAL_STORE_PATH, "utf-8")
    const parsed = JSON.parse(raw) as Partial<LocalStoreFile>
    const merged = mergeAdminState(
      globalForStore.__daLocalStoreCache ?? createDefaultStore(),
      parsed
    )
    globalForStore.__daLocalStoreCache = merged
    return merged
  } catch {
    if (globalForStore.__daLocalStoreCache) {
      return globalForStore.__daLocalStoreCache
    }
    const def = createDefaultStore()
    globalForStore.__daLocalStoreCache = def
    return def
  }
}

async function writeDiskAndMemoryStore(store: LocalStoreFile): Promise<void> {
  globalForStore.__daLocalStoreCache = store
  try {
    await fs.mkdir(path.dirname(LOCAL_STORE_PATH), { recursive: true })
    await fs.writeFile(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), "utf-8")
  } catch {
    try {
      const tmpPath = path.join(os.tmpdir(), "da-admin-store.json")
      await fs.writeFile(tmpPath, JSON.stringify(store, null, 2), "utf-8")
    } catch {
      // Keep in globalForStore.__daLocalStoreCache
    }
  }
}

async function readLocalStore(forceCloudSync = false): Promise<LocalStoreFile> {
  let local = await readDiskOrMemoryStore()

  if (IS_READONLY_SERVERLESS && !isMySqlConfigured()) {
    const now = Date.now()
    const lastSync = globalForStore.__daLastCloudAdminSync ?? 0
    if (forceCloudSync || now - lastSync > 1500) {
      globalForStore.__daLastCloudAdminSync = now
      const cloudAdmin =
        await loadCompressedFromCloudKeys<Partial<LocalStoreFile>>(
          CLOUD_ADMIN_KEYS
        )
      if (cloudAdmin) {
        local = mergeAdminState(local, cloudAdmin)
        await writeDiskAndMemoryStore(local)
      }
    }
  }

  return local
}

async function writeLocalStore(
  store: LocalStoreFile,
  syncAdminCloud = true
): Promise<void> {
  await writeDiskAndMemoryStore(store)

  if (syncAdminCloud && IS_READONLY_SERVERLESS && !isMySqlConfigured()) {
    const cloudAdmin =
      await loadCompressedFromCloudKeys<Partial<LocalStoreFile>>(
        CLOUD_ADMIN_KEYS
      )
    const merged = mergeAdminState(store, cloudAdmin)
    await writeDiskAndMemoryStore(merged)
    const adminPayload: Partial<LocalStoreFile> = {
      adminUser: merged.adminUser,
      overrides: merged.overrides,
      imageRestoredAt: merged.imageRestoredAt,
      productChanges: merged.productChanges,
      productRestoredAt: merged.productRestoredAt,
    }
    await saveCompressedToCloudKeys(CLOUD_ADMIN_KEYS, adminPayload)
    globalForStore.__daLastCloudAdminSync = Date.now()
  }
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

  // 2. Write new image to public/images/... on disk (or /tmp on serverless) so static file is updated immediately
  try {
    await fs.mkdir(path.dirname(publicFilePath), { recursive: true })
    await fs.writeFile(publicFilePath, buffer)
  } catch {
    try {
      const tmpSlotDir = path.join(os.tmpdir(), "da-slot-images")
      await fs.mkdir(tmpSlotDir, { recursive: true })
      await fs.writeFile(path.join(tmpSlotDir, `${slot.key}.bin`), buffer)
    } catch {
      // Ignore
    }
  }

  const meta: ImageOverrideMeta = {
    key: slot.key,
    path: slot.path,
    mimeType,
    updatedAt: now,
  }

  // 3. Save in local store metadata
  const local = await readLocalStore(true)
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

  const local = await readLocalStore(true)
  delete local.overrides[slot.key]
  local.imageRestoredAt = local.imageRestoredAt ?? {}
  local.imageRestoredAt[slot.key] = Date.now()
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
      const tmpProdPath = path.join(os.tmpdir(), "da-prod-images", `${prodSlug}.webp`)
      const buffer = await fs.readFile(tmpProdPath)
      return { buffer, mimeType: "image/webp" }
    } catch {
      // Fallback to public/images/catalogo
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
    const tmpSlotPath = path.join(os.tmpdir(), "da-slot-images", `${slot.key}.bin`)
    const buffer = await fs.readFile(tmpSlotPath)
    return { buffer, mimeType: "image/webp" }
  } catch {
    // Fallback to public/
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
    } catch {
      try {
        const tmpProdDir = path.join(os.tmpdir(), "da-prod-images")
        await fs.mkdir(tmpProdDir, { recursive: true })
        await fs.writeFile(path.join(tmpProdDir, `${targetSlug}.webp`), imageBuffer)
      } catch {
        // Ignore
      }
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
  const local = await readLocalStore(true)
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

  const local = await readLocalStore(true)
  local.productChanges = local.productChanges ?? {}
  if (isBaseProduct) {
    local.productChanges[slug] = {
      slug,
      action: "delete",
      updatedAt: now,
    }
  } else {
    delete local.productChanges[slug]
    local.productRestoredAt = local.productRestoredAt ?? {}
    local.productRestoredAt[slug] = now
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
  const local = await readLocalStore(true)
  if (local.productChanges) {
    delete local.productChanges[slug]
  }
  local.productRestoredAt = local.productRestoredAt ?? {}
  local.productRestoredAt[slug] = Date.now()
  await writeLocalStore(local)

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

function toCompactClicksPayload(store: LocalStoreFile): CompactClicksCloudPayload {
  const c: Record<string, [number, number, number, number, number]> = {}
  for (const [slug, stat] of Object.entries(store.productClicks ?? {})) {
    const total =
      (stat.viewClicksLima || 0) +
      (stat.viewClicksArequipa || 0) +
      (stat.whatsappClicksLima || 0) +
      (stat.whatsappClicksArequipa || 0)
    if (total > 0) {
      c[slug] = [
        stat.viewClicksLima || 0,
        stat.viewClicksArequipa || 0,
        stat.whatsappClicksLima || 0,
        stat.whatsappClicksArequipa || 0,
        stat.lastClickedAt || 0,
      ]
    }
  }
  return {
    r: store.clicksResetAt ?? 0,
    s: store.slugResetAt ?? {},
    c,
  }
}

function fromCompactClicksPayload(
  payload: CompactClicksCloudPayload | null
): Partial<LocalStoreFile> | null {
  if (!payload) return null
  const productClicks: Record<string, ProductClickStats> = {}
  for (const [slug, arr] of Object.entries(payload.c ?? {})) {
    if (!Array.isArray(arr)) continue
    productClicks[slug] = {
      slug,
      viewClicksLima: Number(arr[0] || 0),
      viewClicksArequipa: Number(arr[1] || 0),
      whatsappClicksLima: Number(arr[2] || 0),
      whatsappClicksArequipa: Number(arr[3] || 0),
      lastClickedAt: Number(arr[4] || 0),
    }
  }
  return {
    clicksResetAt: Number(payload.r || 0),
    slugResetAt: payload.s ?? {},
    productClicks,
  }
}

function enqueueClickOp<T>(fn: () => Promise<T>): Promise<T> {
  const prev = globalForStore.__daClicksQueue ?? Promise.resolve()
  const next = prev.then(fn, fn)
  globalForStore.__daClicksQueue = next.then(
    () => undefined,
    () => undefined
  )
  return next
}

export async function recordProductClick(
  slug: string,
  clickType: "view" | "whatsapp" = "view",
  city: "lima" | "arequipa" = "lima"
): Promise<void> {
  const cleanSlug = slug.trim()
  if (!cleanSlug) return

  await enqueueClickOp(async () => {
    const now = Date.now()

    // 1. Load local store and merge latest cloud clicks state if in serverless mode
    let local = await readDiskOrMemoryStore()
    if (IS_READONLY_SERVERLESS && !isMySqlConfigured()) {
      const cloudCompact =
        await loadCompressedFromCloudKeys<CompactClicksCloudPayload>(
          CLOUD_CLICKS_KEYS
        )
      local = mergeAdminState(local, fromCompactClicksPayload(cloudCompact))
    }

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

    await writeDiskAndMemoryStore(local)
    if (IS_READONLY_SERVERLESS && !isMySqlConfigured()) {
      await saveCompressedToCloudKeys(
        CLOUD_CLICKS_KEYS,
        toCompactClicksPayload(local)
      )
      globalForStore.__daLastCloudClicksSync = now
    }

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
  })
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

  let local = await readDiskOrMemoryStore()
  if (IS_READONLY_SERVERLESS && !isMySqlConfigured()) {
    const cloudCompact =
      await loadCompressedFromCloudKeys<CompactClicksCloudPayload>(
        CLOUD_CLICKS_KEYS
      )
    if (cloudCompact) {
      local = mergeAdminState(local, fromCompactClicksPayload(cloudCompact))
      await writeDiskAndMemoryStore(local)
    }
  }
  return local.productClicks ?? {}
}

export async function resetProductClicks(slug?: string): Promise<void> {
  await enqueueClickOp(async () => {
    const now = Date.now()
    let local = await readDiskOrMemoryStore()
    if (IS_READONLY_SERVERLESS && !isMySqlConfigured()) {
      const cloudCompact =
        await loadCompressedFromCloudKeys<CompactClicksCloudPayload>(
          CLOUD_CLICKS_KEYS
        )
      local = mergeAdminState(local, fromCompactClicksPayload(cloudCompact))
    }

    local.productClicks = local.productClicks ?? {}
    local.slugResetAt = local.slugResetAt ?? {}

    if (!slug || slug === "all") {
      local.productClicks = {}
      local.clicksResetAt = now
      local.slugResetAt = {}
    } else {
      delete local.productClicks[slug]
      local.slugResetAt[slug] = now
    }

    await writeDiskAndMemoryStore(local)
    if (IS_READONLY_SERVERLESS && !isMySqlConfigured()) {
      await saveCompressedToCloudKeys(
        CLOUD_CLICKS_KEYS,
        toCompactClicksPayload(local)
      )
      globalForStore.__daLastCloudClicksSync = now
    }

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
  })
}
