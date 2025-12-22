/*
  Warnings:

  - You are about to drop the column `emergencyContact` on the `CyclistProfile` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyPhone` on the `CyclistProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CyclistProfile" DROP COLUMN "emergencyContact",
DROP COLUMN "emergencyPhone",
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "emergencyContactName" TEXT,
ADD COLUMN     "emergencyContactPhone" TEXT,
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "jerseySize" TEXT,
ADD COLUMN     "teamName" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION;
