-- DropForeignKey
ALTER TABLE "public"."CyclistProfile" DROP CONSTRAINT "CyclistProfile_categoryId_fkey";

-- AlterTable
ALTER TABLE "CyclistProfile" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CyclistProfile" ADD CONSTRAINT "CyclistProfile_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
