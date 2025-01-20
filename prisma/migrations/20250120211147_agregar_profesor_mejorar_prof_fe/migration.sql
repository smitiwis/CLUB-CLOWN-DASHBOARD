-- AlterTable
ALTER TABLE "profesor" ALTER COLUMN "estado" SET DEFAULT '1';

-- AlterTable
ALTER TABLE "taller" ADD COLUMN     "estado" VARCHAR(1) NOT NULL DEFAULT '1';
