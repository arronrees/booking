-- CreateEnum
CREATE TYPE "UserAdminRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- CreateTable
CREATE TABLE "UserAdminRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "UserAdminRequestStatus" NOT NULL DEFAULT 'PENDING',
    "dateComplete" TIMESTAMP(3),
    "complete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserAdminRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAdminRequest_id_key" ON "UserAdminRequest"("id");

-- AddForeignKey
ALTER TABLE "UserAdminRequest" ADD CONSTRAINT "UserAdminRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
