/*
  Warnings:

  - You are about to drop the `PostEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FeedEventType" AS ENUM ('POST_CREATED', 'POST_REACTION_CREATED', 'POST_REPLY_CREATED', 'TREND_SEEN');

-- DropForeignKey
ALTER TABLE "PostEvent" DROP CONSTRAINT "PostEvent_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostEvent" DROP CONSTRAINT "PostEvent_postReactionId_fkey";

-- DropForeignKey
ALTER TABLE "PostEvent" DROP CONSTRAINT "PostEvent_tagId_fkey";

-- DropForeignKey
ALTER TABLE "PostEvent" DROP CONSTRAINT "PostEvent_userId_fkey";

-- DropTable
DROP TABLE "PostEvent";

-- DropEnum
DROP TYPE "PostEventType";

-- CreateTable
CREATE TABLE "FeedEvent" (
    "id" BIGINT NOT NULL DEFAULT generate_id(),
    "cursor" TEXT,
    "postId" TEXT,
    "tagId" TEXT,
    "userId" TEXT,
    "postReactionId" BIGINT,
    "type" "FeedEventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FeedEvent" ADD CONSTRAINT "FeedEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedEvent" ADD CONSTRAINT "FeedEvent_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedEvent" ADD CONSTRAINT "FeedEvent_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedEvent" ADD CONSTRAINT "FeedEvent_postReactionId_fkey" FOREIGN KEY ("postReactionId") REFERENCES "PostReaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
