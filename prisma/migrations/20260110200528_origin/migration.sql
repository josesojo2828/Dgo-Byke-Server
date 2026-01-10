-- DropForeignKey
ALTER TABLE "public"."Track" DROP CONSTRAINT "Track_organizationId_fkey";

-- AlterTable
ALTER TABLE "Track" ALTER COLUMN "organizationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
