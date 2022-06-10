/*
  Warnings:

  - You are about to drop the column `cursor` on the `FeedEvent` table. All the data in the column will be lost.
  - Made the column `tagId` on table `FeedEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "PostReaction_createdAt_key";

-- AlterTable
ALTER TABLE "FeedEvent" DROP COLUMN "cursor",
ALTER COLUMN "tagId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "FeedEvent_createdAt_idx" ON "FeedEvent"("createdAt");

-- CreateIndex
CREATE INDEX "FeedEvent_postId_idx" ON "FeedEvent"("postId");

-- CreateIndex
CREATE INDEX "FeedEvent_postReactionId_idx" ON "FeedEvent"("postReactionId");

-- CreateIndex
CREATE INDEX "FeedEvent_tagId_idx" ON "FeedEvent"("tagId");

-- CreateIndex
CREATE INDEX "FeedEvent_userId_idx" ON "FeedEvent"("userId");
