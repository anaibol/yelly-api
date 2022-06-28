-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ageEstimation" INTEGER,
ADD COLUMN     "agePredictionResult" TEXT,
ADD COLUMN     "facePictureId" TEXT,
ADD COLUMN     "isAgeApproved" BOOLEAN NOT NULL DEFAULT false;
