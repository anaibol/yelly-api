/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `country` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `country_name_key` ON `country`(`name`);
