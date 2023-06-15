/*
  Warnings:

  - You are about to drop the `TagRank` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TagRank" DROP CONSTRAINT "TagRank_postId_fkey";

-- DropForeignKey
ALTER TABLE "TagRank" DROP CONSTRAINT "TagRank_tagId_fkey";

-- DropTable
DROP TABLE "TagRank";

-- CreateTable
CREATE TABLE "PostTagRank" (
    "id" TEXT NOT NULL DEFAULT generate_id(),
    "tagId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "position" INTEGER,
    "previousPosition" INTEGER,

    CONSTRAINT "PostTagRank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostTagRank_tagId_key" ON "PostTagRank"("tagId");

-- CreateIndex
CREATE INDEX "PostTagRank_tagId_postId_idx" ON "PostTagRank"("tagId", "postId");

-- CreateIndex
CREATE INDEX "PostTagRank_tagId_idx" ON "PostTagRank"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "PostTagRank_tagId_position_key" ON "PostTagRank"("tagId", "position");

-- AddForeignKey
ALTER TABLE "PostTagRank" ADD CONSTRAINT "PostTagRank_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTagRank" ADD CONSTRAINT "PostTagRank_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
