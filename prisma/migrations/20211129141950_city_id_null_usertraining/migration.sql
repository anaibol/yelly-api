/*
  Warnings:

  - You are about to drop the `_followship` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[city_id]` on the table `user_training` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_followship` DROP FOREIGN KEY `_followship_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_followship` DROP FOREIGN KEY `_followship_ibfk_2`;

-- DropTable
DROP TABLE `_followship`;

-- CreateTable
CREATE TABLE `Followship` (
    `followerId` BINARY(16) NOT NULL,
    `followeeId` BINARY(16) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Followship_createdAt_key`(`createdAt`),
    PRIMARY KEY (`followerId`, `followeeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `user_training_city_id_key` ON `user_training`(`city_id`);

-- AddForeignKey
ALTER TABLE `Followship` ADD CONSTRAINT `Followship_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Followship` ADD CONSTRAINT `Followship_followeeId_fkey` FOREIGN KEY (`followeeId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
