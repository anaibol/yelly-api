/*
  Warnings:

  - You are about to drop the column `followerFolloweeId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `followerUserId` on the `Notification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[followerId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_followerUserId_followerFolloweeId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "followerFolloweeId",
DROP COLUMN "followerUserId",
ADD COLUMN     "followerId" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isAgeApproved" DROP NOT NULL,
ALTER COLUMN "isAgeApproved" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_followerId_key" ON "Notification"("followerId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Follower"("id") ON DELETE CASCADE ON UPDATE CASCADE;
