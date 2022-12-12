-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('MUSIC', 'FESTIVAL', 'THEATRE', 'SPORT', 'OTHER');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "type" "EventType" NOT NULL DEFAULT 'OTHER';
