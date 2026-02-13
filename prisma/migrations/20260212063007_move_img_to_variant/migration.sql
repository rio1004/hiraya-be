/*
  Warnings:

  - You are about to drop the column `imgSrc` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imgSrc";

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "imgSrc" TEXT;
