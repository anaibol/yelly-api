/*
  Warnings:

  - The primary key for the `Friend` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Friend` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`userId`, `otherUserId`);

-- CreateIndex
CREATE UNIQUE INDEX `Friend_id_key` ON `Friend`(`id`);
