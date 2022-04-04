/*
  Warnings:

  - You are about to drop the `PostComment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `PostComment` DROP FOREIGN KEY `PostComment_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `PostComment` DROP FOREIGN KEY `PostComment_postId_fkey`;

-- DropTable
DROP TABLE `PostComment`;
