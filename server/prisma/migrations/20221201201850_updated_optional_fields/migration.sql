/*
  Warnings:

  - Added the required column `adminUserId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "addressLine2" DROP NOT NULL,
ALTER COLUMN "county" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "adminUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
