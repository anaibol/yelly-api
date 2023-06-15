/*
  Warnings:

  - A unique constraint covering the columns `[followshipId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "followshipId" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "threadId" TEXT;

-- CreateTable
CREATE TABLE "Followship" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Followship_pkey" PRIMARY KEY ("followerId","followeeId")
);

-- CreateTable
CREATE TABLE "Thread" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Followship_id_key" ON "Followship"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Followship_createdAt_key" ON "Followship"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_followshipId_key" ON "Notification"("followshipId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_followshipId_fkey" FOREIGN KEY ("followshipId") REFERENCES "Followship"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followship" ADD CONSTRAINT "Followship_followeeId_fkey" FOREIGN KEY ("followeeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Followship" ADD CONSTRAINT "Followship_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE SET NULL ON UPDATE CASCADE;
