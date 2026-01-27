-- CreateTable
CREATE TABLE "RaceCategory" (
    "id" TEXT NOT NULL,
    "raceId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RaceCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RaceCategory" ADD CONSTRAINT "RaceCategory_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RaceCategory" ADD CONSTRAINT "RaceCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
