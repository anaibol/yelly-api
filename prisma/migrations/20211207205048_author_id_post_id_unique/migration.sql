/*
  Warnings:

  - A unique constraint covering the columns `[author_id,id]` on the table `post` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `PostReaction` DROP FOREIGN KEY `PostReaction_postId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `post_author_id_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `author_post_id_fkey` ON `post`(`author_id`, `id`);

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostReaction` ADD CONSTRAINT `PostReaction_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
