-- AlterTable
ALTER TABLE `Session` ADD COLUMN `lastUsed` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
