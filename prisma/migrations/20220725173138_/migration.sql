/*
  Warnings:

  - You are about to drop the column `date` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Tag` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Activity_userId_date_idx";

-- DropIndex
DROP INDEX "Notification_date_idx";

-- DropIndex
DROP INDEX "Tag_date_idx";

-- DropIndex
DROP INDEX "Tag_text_date_key";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "date";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "date";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "date";
