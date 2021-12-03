/*
  Warnings:

  - Made the column `country_id` on table `city` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city_id` on table `school` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `city` DROP FOREIGN KEY `FK_2D5B0234F92F3E70`;

-- DropForeignKey
ALTER TABLE `school` DROP FOREIGN KEY `school_city_id_fkey`;

-- AlterTable
ALTER TABLE `city` MODIFY `country_id` BINARY(16) NOT NULL;

-- AlterTable
ALTER TABLE `school` MODIFY `city_id` BINARY(16) NOT NULL;

-- AddForeignKey
ALTER TABLE `city` ADD CONSTRAINT `FK_2D5B0234F92F3E70` FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `school` ADD CONSTRAINT `school_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
