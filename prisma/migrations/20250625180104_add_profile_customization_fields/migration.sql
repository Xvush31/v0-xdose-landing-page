-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "birthdate" TIMESTAMP(3),
ADD COLUMN     "cover" TEXT,
ADD COLUMN     "customLinks" TEXT[],
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "twitter" TEXT,
ADD COLUMN     "website" TEXT;
