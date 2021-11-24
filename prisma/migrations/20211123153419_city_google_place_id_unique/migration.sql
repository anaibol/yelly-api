/*
  Warnings:

  - A unique constraint covering the columns `[google_place_id]` on the table `city` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `city_google_place_id_key` ON `city`(`google_place_id`);
