-- AlterTable
ALTER TABLE "taller_cliente" ADD COLUMN     "estado" VARCHAR(1) NOT NULL DEFAULT '1',
ADD COLUMN     "observacion" TEXT NOT NULL DEFAULT '';
