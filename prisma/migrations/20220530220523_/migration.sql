/*
  Warnings:

  - You are about to drop the `PostTagRank` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostTagRank" DROP CONSTRAINT "PostTagRank_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostTagRank" DROP CONSTRAINT "PostTagRank_tagId_fkey";

-- DropIndex
DROP INDEX "FollowRequest_requesterId_toFollowUserId_status_key";

-- DropTable
DROP TABLE "PostTagRank";

-- CreateTable
CREATE TABLE "PostUserRank" (
    "id" BIGINT NOT NULL DEFAULT generate_id(),
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PostUserRank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostUserRank_userId_postId_idx" ON "PostUserRank"("userId", "postId");

-- CreateIndex
CREATE INDEX "PostUserRank_userId_idx" ON "PostUserRank"("userId");

-- AddForeignKey
ALTER TABLE "PostUserRank" ADD CONSTRAINT "PostUserRank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostUserRank" ADD CONSTRAINT "PostUserRank_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
