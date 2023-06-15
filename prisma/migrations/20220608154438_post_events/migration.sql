/*
  Warnings:

  - The values [POST_SEEN] on the enum `PostEventType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Friend` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PostEventType_new" AS ENUM ('POST_CREATED', 'POST_REACTION_CREATED', 'POST_REPLY_CREATED', 'TREND_SEEN');
ALTER TABLE "PostEvent" ALTER COLUMN "type" TYPE "PostEventType_new" USING ("type"::text::"PostEventType_new");
ALTER TYPE "PostEventType" RENAME TO "PostEventType_old";
ALTER TYPE "PostEventType_new" RENAME TO "PostEventType";
DROP TYPE "PostEventType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_otherUserId_fkey";

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_userId_fkey";

-- AlterTable
ALTER TABLE "PostEvent" ADD COLUMN     "tagId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userId";

-- DropTable
DROP TABLE "Friend";

-- AddForeignKey
ALTER TABLE "PostEvent" ADD CONSTRAINT "PostEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostEvent" ADD CONSTRAINT "PostEvent_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
