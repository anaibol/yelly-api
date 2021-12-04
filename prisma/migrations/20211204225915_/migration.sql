/*
  Warnings:

  - A unique constraint covering the columns `[authorId,postId]` on the table `PostReaction` will be added. If there are existing duplicate values, this will fail.
  - Made the column `postId` on table `PostReaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `PostReaction` DROP FOREIGN KEY `PostReaction_postId_fkey`;

-- AlterTable
ALTER TABLE `PostReaction` MODIFY `postId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `author_post_id_fkey` ON `PostReaction`(`authorId`, `postId`);

-- AddForeignKey
ALTER TABLE `PostReaction` ADD CONSTRAINT `PostReaction_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
