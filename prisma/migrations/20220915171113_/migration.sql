/*
 Warnings:
 
 - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
 
 */
-- AlterTable
ALTER TABLE "User"
ALTER COLUMN "displayName" DROP NOT NULL,
  ALTER COLUMN "displayName" DROP DEFAULT,
  ALTER COLUMN "username" DROP NOT NULL,
  ALTER COLUMN "username" DROP DEFAULT;
UPDATE "User"
SET "username" = NULL
WHERE "username" = '';
UPDATE "User"
SET "displayName" = NULL
WHERE "displayName" = '';
-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");