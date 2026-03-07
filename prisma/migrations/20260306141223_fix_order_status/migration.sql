/*
  Warnings:

  - The primary key for the `Address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `brgy` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `fullAddress` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `Address` table. All the data in the column will be lost.
  - The `id` column on the `Address` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Barangay` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cityId` on the `Barangay` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Barangay` table. All the data in the column will be lost.
  - The primary key for the `City` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `City` table. All the data in the column will be lost.
  - You are about to drop the column `provinceId` on the `City` table. All the data in the column will be lost.
  - You are about to drop the column `regionId` on the `City` table. All the data in the column will be lost.
  - The primary key for the `Province` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Province` table. All the data in the column will be lost.
  - You are about to drop the column `regionId` on the `Province` table. All the data in the column will be lost.
  - The primary key for the `Region` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `LastName` on the `User` table. All the data in the column will be lost.
  - Added the required column `barangayCode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityCode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactName` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactPhone` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regionCode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityCode` to the `Barangay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Barangay` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regionCode` to the `City` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `code` to the `Province` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regionCode` to the `Province` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Region` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Barangay" DROP CONSTRAINT "Barangay_cityId_fkey";

-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_provinceId_fkey";

-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_regionId_fkey";

-- DropForeignKey
ALTER TABLE "Province" DROP CONSTRAINT "Province_regionId_fkey";

-- DropIndex
DROP INDEX "Barangay_cityId_idx";

-- DropIndex
DROP INDEX "City_provinceId_idx";

-- DropIndex
DROP INDEX "City_regionId_idx";

-- DropIndex
DROP INDEX "Province_regionId_idx";

-- DropIndex
DROP INDEX "Region_name_idx";

-- AlterTable
ALTER TABLE "Address" DROP CONSTRAINT "Address_pkey",
DROP COLUMN "brgy",
DROP COLUMN "city",
DROP COLUMN "fullAddress",
DROP COLUMN "province",
ADD COLUMN     "barangayCode" TEXT NOT NULL,
ADD COLUMN     "building" TEXT,
ADD COLUMN     "cityCode" TEXT NOT NULL,
ADD COLUMN     "contactName" TEXT NOT NULL,
ADD COLUMN     "contactPhone" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "provinceCode" TEXT,
ADD COLUMN     "regionCode" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Address_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Barangay" DROP CONSTRAINT "Barangay_pkey",
DROP COLUMN "cityId",
DROP COLUMN "id",
ADD COLUMN     "cityCode" TEXT NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Barangay_pkey" PRIMARY KEY ("code");

-- AlterTable
ALTER TABLE "City" DROP CONSTRAINT "City_pkey",
DROP COLUMN "id",
DROP COLUMN "provinceId",
DROP COLUMN "regionId",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "provinceCode" TEXT,
ADD COLUMN     "regionCode" TEXT NOT NULL,
ADD CONSTRAINT "City_pkey" PRIMARY KEY ("code");

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Province" DROP CONSTRAINT "Province_pkey",
DROP COLUMN "id",
DROP COLUMN "regionId",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "regionCode" TEXT NOT NULL,
ADD CONSTRAINT "Province_pkey" PRIMARY KEY ("code");

-- AlterTable
ALTER TABLE "Region" DROP CONSTRAINT "Region_pkey",
DROP COLUMN "id",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Region_pkey" PRIMARY KEY ("code");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "LastName",
ADD COLUMN     "lastName" TEXT;

-- CreateTable
CREATE TABLE "ShippingFee" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "fee" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "ShippingFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegionZone" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "regionCode" TEXT NOT NULL,

    CONSTRAINT "RegionZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingZone" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ShippingZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostalCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "cityCode" TEXT NOT NULL,
    "barangayCode" TEXT,

    CONSTRAINT "PostalCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegionZone_zoneId_regionCode_key" ON "RegionZone"("zoneId", "regionCode");

-- CreateIndex
CREATE INDEX "PostalCode_code_idx" ON "PostalCode"("code");

-- CreateIndex
CREATE INDEX "Address_userId_idx" ON "Address"("userId");

-- CreateIndex
CREATE INDEX "Barangay_cityCode_idx" ON "Barangay"("cityCode");

-- CreateIndex
CREATE INDEX "CartItem_variantId_idx" ON "CartItem"("variantId");

-- CreateIndex
CREATE INDEX "City_provinceCode_idx" ON "City"("provinceCode");

-- CreateIndex
CREATE INDEX "City_regionCode_idx" ON "City"("regionCode");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_variantId_idx" ON "OrderItem"("variantId");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "Province_regionCode_idx" ON "Province"("regionCode");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_regionCode_fkey" FOREIGN KEY ("regionCode") REFERENCES "Region"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_provinceCode_fkey" FOREIGN KEY ("provinceCode") REFERENCES "Province"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_cityCode_fkey" FOREIGN KEY ("cityCode") REFERENCES "City"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_barangayCode_fkey" FOREIGN KEY ("barangayCode") REFERENCES "Barangay"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingFee" ADD CONSTRAINT "ShippingFee_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "ShippingZone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionZone" ADD CONSTRAINT "RegionZone_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "ShippingZone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegionZone" ADD CONSTRAINT "RegionZone_regionCode_fkey" FOREIGN KEY ("regionCode") REFERENCES "Region"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostalCode" ADD CONSTRAINT "PostalCode_cityCode_fkey" FOREIGN KEY ("cityCode") REFERENCES "City"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostalCode" ADD CONSTRAINT "PostalCode_barangayCode_fkey" FOREIGN KEY ("barangayCode") REFERENCES "Barangay"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Province" ADD CONSTRAINT "Province_regionCode_fkey" FOREIGN KEY ("regionCode") REFERENCES "Region"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_regionCode_fkey" FOREIGN KEY ("regionCode") REFERENCES "Region"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_provinceCode_fkey" FOREIGN KEY ("provinceCode") REFERENCES "Province"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barangay" ADD CONSTRAINT "Barangay_cityCode_fkey" FOREIGN KEY ("cityCode") REFERENCES "City"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
