/*
  Warnings:

  - You are about to drop the `_PostToTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tagId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_B_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "tagId" BIGINT NOT NULL;

-- DropTable
DROP TABLE "_PostToTag";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
