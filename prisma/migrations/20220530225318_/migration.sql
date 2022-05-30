/*
  Warnings:

  - You are about to drop the `PostUserRank` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PostEventType" AS ENUM ('POST_CREATED', 'POST_REACTION_CREATED', 'POST_REPLY_CREATED', 'POST_SEEN');

-- DropForeignKey
ALTER TABLE "PostUserRank" DROP CONSTRAINT "PostUserRank_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostUserRank" DROP CONSTRAINT "PostUserRank_userId_fkey";

-- DropTable
DROP TABLE "PostUserRank";

-- CreateTable
CREATE TABLE "PostEvent" (
    "id" BIGINT NOT NULL DEFAULT generate_id(),
    "postId" TEXT,
    "type" "PostEventType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostEvent" ADD CONSTRAINT "PostEvent_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
