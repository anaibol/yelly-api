/*
  Warnings:

  - You are about to drop the column `followerId` on the `Notification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[followerUserId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_followerId_fkey";

-- DropIndex
DROP INDEX "Notification_followerId_key";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "followerId",
ADD COLUMN     "followerUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_followerUserId_key" ON "Notification"("followerUserId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
