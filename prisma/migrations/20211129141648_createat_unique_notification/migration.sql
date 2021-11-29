/*
  Warnings:

  - You are about to drop the `_posts_like` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[created_at]` on the table `notification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_posts_like` DROP FOREIGN KEY `_posts_like_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_posts_like` DROP FOREIGN KEY `_posts_like_ibfk_2`;

-- DropForeignKey
ALTER TABLE `user_training` DROP FOREIGN KEY `FK_359F6E8F8BAC62AF`;

-- DropTable
DROP TABLE `_posts_like`;

-- CreateTable
CREATE TABLE `PostReaction` (
    `id` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reaction` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NULL,
    `authorId` BINARY(16) NOT NULL,

    UNIQUE INDEX `PostReaction_createdAt_key`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `notification_created_at_key` ON `notification`(`created_at`);

-- AddForeignKey
ALTER TABLE `user_training` ADD CONSTRAINT `FK_359F6E8F8BAC62AF` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `PostReaction` ADD CONSTRAINT `PostReaction_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostReaction` ADD CONSTRAINT `PostReaction_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
