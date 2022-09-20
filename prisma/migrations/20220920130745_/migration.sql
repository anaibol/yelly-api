/*
  Warnings:

  - You are about to drop the column `rank` on the `Tag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "rank";

-- CreateTable
CREATE TABLE "_memberOfTags" (
    "A" BIGINT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_memberOfTags_AB_unique" ON "_memberOfTags"("A", "B");

-- CreateIndex
CREATE INDEX "_memberOfTags_B_index" ON "_memberOfTags"("B");

-- AddForeignKey
ALTER TABLE "_memberOfTags" ADD CONSTRAINT "_memberOfTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_memberOfTags" ADD CONSTRAINT "_memberOfTags_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
