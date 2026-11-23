import fs from "fs/promises"
import path from "path"
import mysql from "mysql2/promise"
import {
  DEFAULT_ADMIN_PASSWORD_HASH,
  DEFAULT_ADMIN_USERNAME,
} from "@/lib/admin-auth"
import { EDITABLE_IMAGE_SLOTS } from "@/data/site-images-catalog"

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

interface LocalStoreFile {
  adminUser: StoredAdminUser
  overrides: Record<string, ImageOverrideMeta>
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
    }
  } catch {
    return {
      adminUser: {
        username: DEFAULT_ADMIN_USERNAME,
        passwordHash: DEFAULT_ADMIN_PASSWORD_HASH,
        updatedAt: new Date().toISOString(),
      },
      overrides: {},
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
