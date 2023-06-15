/*
  Warnings:

  - You are about to drop the column `followshipId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `Followship` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[followId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Followship" DROP CONSTRAINT "Followship_followeeId_fkey";

-- DropForeignKey
ALTER TABLE "Followship" DROP CONSTRAINT "Followship_followerId_fkey";

-- DropIndex
DROP INDEX "Notification_followshipId_key";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "followshipId",
ADD COLUMN     "followId" TEXT;

-- DropTable
DROP TABLE "Followship";

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("followerId","followeeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Follow_id_key" ON "Follow"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_createdAt_key" ON "Follow"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_followId_key" ON "Notification"("followId");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followeeId_fkey" FOREIGN KEY ("followeeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
