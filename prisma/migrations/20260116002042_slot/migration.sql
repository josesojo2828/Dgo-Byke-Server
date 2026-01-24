-- AlterTable
ALTER TABLE "RaceEvent" ADD COLUMN     "lapTime" INTEGER,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "totalAccumulatedTime" INTEGER;
