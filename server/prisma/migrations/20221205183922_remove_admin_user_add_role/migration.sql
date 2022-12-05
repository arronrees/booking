/*
  Warnings:

  - You are about to drop the column `adminUserId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `AdminUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- DropForeignKey
ALTER TABLE "AdminUser" DROP CONSTRAINT "AdminUser_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_adminUserId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "adminUserId",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "AdminUser";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
