-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'YOUR_TAG_IS_TRENDING';
ALTER TYPE "NotificationType" ADD VALUE 'NEW_POSTS_ON_YOUR_TAG';

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_followerUserId_followerFolloweeId_fkey";

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "followerFolloweeId" DROP NOT NULL,
ALTER COLUMN "followerUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_followerUserId_followerFolloweeId_fkey" FOREIGN KEY ("followerUserId", "followerFolloweeId") REFERENCES "Follower"("userId", "followeeId") ON DELETE SET NULL ON UPDATE CASCADE;
