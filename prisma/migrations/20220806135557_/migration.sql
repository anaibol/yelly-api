-- CreateTable
CREATE TABLE "UserReport" (
    "id" BIGINT NOT NULL DEFAULT generate_id(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "UserReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserReport_authorId_userId_key" ON "UserReport"("authorId", "userId");

-- AddForeignKey
ALTER TABLE "UserReport" ADD CONSTRAINT "UserReport_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReport" ADD CONSTRAINT "UserReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
