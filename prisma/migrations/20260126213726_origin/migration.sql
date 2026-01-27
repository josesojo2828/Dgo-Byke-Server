-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "metadata" JSONB;

-- CreateTable
CREATE TABLE "CyclistProfileCategory" (
    "id" TEXT NOT NULL,
    "cyclistProfileId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CyclistProfileCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CyclistProfileCategory" ADD CONSTRAINT "CyclistProfileCategory_cyclistProfileId_fkey" FOREIGN KEY ("cyclistProfileId") REFERENCES "CyclistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CyclistProfileCategory" ADD CONSTRAINT "CyclistProfileCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
