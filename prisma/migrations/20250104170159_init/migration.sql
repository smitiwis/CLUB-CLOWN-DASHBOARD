/*
  Warnings:

  - Added the required column `comentario` to the `cliente_llamada` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cliente" ADD COLUMN     "fecha_recontacto" TIMESTAMP(3),
ADD COLUMN     "origen" VARCHAR(1) NOT NULL DEFAULT '3';

-- AlterTable
ALTER TABLE "cliente_llamada" ADD COLUMN     "comentario" TEXT NOT NULL,
ADD COLUMN     "resultado" VARCHAR(1) NOT NULL DEFAULT '1',
ADD COLUMN     "tipo" VARCHAR(1) NOT NULL DEFAULT '3';
