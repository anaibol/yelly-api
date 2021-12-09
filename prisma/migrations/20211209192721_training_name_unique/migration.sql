/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Training` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Training_name_key` ON `Training`(`name`);
