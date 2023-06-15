/*
  Warnings:

  - A unique constraint covering the columns `[tagReactionId]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "tagReactionId" BIGINT;

-- AlterTable
ALTER TABLE "TagReaction" ADD COLUMN     "activityId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Activity_tagReactionId_key" ON "Activity"("tagReactionId");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_tagReactionId_fkey" FOREIGN KEY ("tagReactionId") REFERENCES "TagReaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
