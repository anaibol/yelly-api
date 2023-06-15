/*
  Warnings:

  - The primary key for the `PostTagRank` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PostTagRank` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PostTagRank" DROP CONSTRAINT "PostTagRank_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGINT NOT NULL DEFAULT generate_id(),
ADD CONSTRAINT "PostTagRank_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "viewsCount" INTEGER NOT NULL DEFAULT 0;
