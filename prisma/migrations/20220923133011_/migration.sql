/*
  Warnings:

  - You are about to drop the column `ageEstimation` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `agePredictionResult` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `birthdate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `facePictureId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `followersCheckCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `followersCheckedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isAgeApproved` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_birthdate";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ageEstimation",
DROP COLUMN "agePredictionResult",
DROP COLUMN "birthdate",
DROP COLUMN "facePictureId",
DROP COLUMN "followersCheckCount",
DROP COLUMN "followersCheckedAt",
DROP COLUMN "isAgeApproved",
DROP COLUMN "isVerified";
