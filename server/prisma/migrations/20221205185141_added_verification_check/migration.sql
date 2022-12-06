-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adminVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;
