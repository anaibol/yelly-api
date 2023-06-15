-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "TagRank" (
    "id" TEXT NOT NULL DEFAULT generate_id(),
    "tagId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "position" INTEGER,
    "previousPosition" INTEGER,

    CONSTRAINT "TagRank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TagRank_tagId_key" ON "TagRank"("tagId");

-- CreateIndex
CREATE INDEX "TagRank_tagId_postId_idx" ON "TagRank"("tagId", "postId");

-- CreateIndex
CREATE INDEX "TagRank_tagId_idx" ON "TagRank"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "TagRank_tagId_position_key" ON "TagRank"("tagId", "position");

-- AddForeignKey
ALTER TABLE "TagRank" ADD CONSTRAINT "TagRank_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagRank" ADD CONSTRAINT "TagRank_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
