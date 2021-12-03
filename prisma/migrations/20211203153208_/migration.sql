/*
  Warnings:

  - You are about to drop the column `date_begin` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `date_end` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `date_begin`,
    DROP COLUMN `date_end`;
