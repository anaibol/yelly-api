/*
  Warnings:

  - You are about to drop the column `followId` on the `Notification` table. All the data in the column will be lost.
  - The `postReactionId` column on the `Notification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PostReaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `reaction` on the `PostReaction` table. All the data in the column will be lost.
  - The `id` column on the `PostReaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_postReactionId_fkey";

-- DropIndex
DROP INDEX "Notification_followId_key";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "followId",
DROP COLUMN "postReactionId",
ADD COLUMN     "postReactionId" BIGINT;

-- AlterTable
ALTER TABLE "PostReaction" DROP CONSTRAINT "PostReaction_pkey",
DROP COLUMN "reaction",
ADD COLUMN     "text" TEXT NOT NULL DEFAULT E'',
DROP COLUMN "id",
ADD COLUMN     "id" BIGINT NOT NULL DEFAULT generate_id(),
ADD CONSTRAINT "PostReaction_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_postReactionId_key" ON "Notification"("postReactionId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_postReactionId_fkey" FOREIGN KEY ("postReactionId") REFERENCES "PostReaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
