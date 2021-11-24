/*
  Warnings:

  - A unique constraint covering the columns `[google_place_id]` on the table `school` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `school_google_place_id_key` ON `school`(`google_place_id`);
