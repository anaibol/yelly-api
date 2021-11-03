/*
  Warnings:

  - A unique constraint covering the columns `[createdAt]` on the table `post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `post_createdAt_key` ON `post`(`createdAt`);
