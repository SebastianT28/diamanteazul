-- ============================================================================
-- DIAMANTE AZUL — SCRIPT DE BASE DE DATOS MYSQL (SITEGROUND GOGEEK)
-- ============================================================================
--Nota: El backend de Next.js también ejecuta automáticamente estos CREATE TABLE
--      al conectarse a MySQL. Puedes importar este archivo en phpMyAdmin de
--      SiteGround si deseas dejar las tablas creadas manualmente.
-- ============================================================================

CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `site_images` (
  `image_key` VARCHAR(120) PRIMARY KEY,
  `target_path` VARCHAR(255) NOT NULL,
  `mime_type` VARCHAR(60) NOT NULL DEFAULT 'image/webp',
  `image_data` LONGBLOB NOT NULL,
  `updated_at` BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usuario inicial:
--   Usuario:    admin
--   Contraseña: diamanteazul26_$
INSERT INTO `admin_users` (`username`, `password_hash`)
SELECT 'admin', 'da2026_salt_f9c4e1a8b2d74305:3a0c3c6a1b90dd377a7ab7f75b912466a01edd228b29dc34fd0d975f4da2ee9d261ca3ab1ac8a2e654d0814e9a808fabbdb8afa47028e00dd9b487d8e8f2d82a'
WHERE NOT EXISTS (SELECT 1 FROM `admin_users` LIMIT 1);
