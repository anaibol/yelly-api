-- AlterTable
ALTER TABLE `Post` ADD COLUMN `expiresAt` DATETIME(3) NULL,
    ADD COLUMN `expiresIn` INTEGER NULL;
