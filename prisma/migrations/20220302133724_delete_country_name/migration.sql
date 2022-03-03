/*
  Warnings:

  - You are about to drop the column `name` on the `Country` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Country` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Country_name_key` ON `Country`;

-- AlterTable
ALTER TABLE `Country` DROP COLUMN `name`;

-- CreateIndex
CREATE UNIQUE INDEX `Country_code_key` ON `Country`(`code`);
