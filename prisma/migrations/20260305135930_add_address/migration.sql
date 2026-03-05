-- AlterTable
ALTER TABLE "User" ADD COLUMN     "LastName" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "mobile" TEXT;

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "fullAddress" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "brgy" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);
