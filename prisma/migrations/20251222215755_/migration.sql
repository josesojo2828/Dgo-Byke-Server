/*
  Warnings:

  - A unique constraint covering the columns `[inviteToken]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "inviteToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_inviteToken_key" ON "Organization"("inviteToken");
