/*
  Warnings:

  - You are about to drop the column `fromUserId` on the `FollowRequest` table. All the data in the column will be lost.
  - You are about to drop the column `toUserId` on the `FollowRequest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FollowRequest" DROP CONSTRAINT "FollowRequest_fromUserId_fkey";

-- DropForeignKey
ALTER TABLE "FollowRequest" DROP CONSTRAINT "FollowRequest_toUserId_fkey";

-- DropIndex
DROP INDEX "FollowRequest_fromUserId_toUserId_idx";

-- AlterTable
ALTER TABLE "FollowRequest" DROP COLUMN "fromUserId",
DROP COLUMN "toUserId",
ADD COLUMN     "requesterId" TEXT,
ADD COLUMN     "toFollowUserId" TEXT;

-- CreateIndex
CREATE INDEX "FollowRequest_requesterId_toFollowUserId_idx" ON "FollowRequest"("requesterId", "toFollowUserId");

-- AddForeignKey
ALTER TABLE "FollowRequest" ADD CONSTRAINT "FollowRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowRequest" ADD CONSTRAINT "FollowRequest_toFollowUserId_fkey" FOREIGN KEY ("toFollowUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
