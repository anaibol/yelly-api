-- /*
--   Warnings:

--   - You are about to drop the column `owner_id` on the `post` table. All the data in the column will be lost.
--   - You are about to drop the column `owner_id` on the `tag` table. All the data in the column will be lost.
--   - A unique constraint covering the columns `[user_id]` on the table `user_training` will be added. If there are existing duplicate values, this will fail.
--   - Added the required column `author_id` to the `post` table without a default value. This is not possible if the table is not empty.
--   - Added the required column `author_id` to the `tag` table without a default value. This is not possible if the table is not empty.

-- */
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `post_owner_id_fkey`;

-- DropForeignKey
ALTER TABLE `tag` DROP FOREIGN KEY `tag_owner_id_fkey`;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `owner_id`,
    ADD COLUMN `author_id` BINARY(16) NOT NULL;

-- AlterTable
ALTER TABLE `tag` DROP COLUMN `owner_id`,
    ADD COLUMN `author_id` BINARY(16) NOT NULL;

-- CreateTable
CREATE TABLE `post_comment` (
    `id` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `author_id` BINARY(16) NOT NULL,

    UNIQUE INDEX `post_comment_createdAt_key`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_followship` (
    `A` BINARY(16) NOT NULL,
    `B` BINARY(16) NOT NULL,

    UNIQUE INDEX `_followship_AB_unique`(`A`, `B`),
    INDEX `_followship_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_posts_like` (
    `A` VARCHAR(191) NOT NULL,
    `B` BINARY(16) NOT NULL,

    UNIQUE INDEX `_posts_like_AB_unique`(`A`, `B`),
    INDEX `_posts_like_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `post_author_id_fkey` ON `post`(`author_id`);

-- CreateIndex
CREATE INDEX `tag_author_id_fkey` ON `tag`(`author_id`);

-- AddForeignKey
ALTER TABLE `tag` ADD CONSTRAINT `tag_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `post_comment` ADD CONSTRAINT `post_comment_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_followship` ADD FOREIGN KEY (`A`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_followship` ADD FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_posts_like` ADD FOREIGN KEY (`A`) REFERENCES `post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_posts_like` ADD FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
