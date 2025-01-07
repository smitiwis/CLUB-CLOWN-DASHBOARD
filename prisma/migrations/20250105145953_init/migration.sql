/*
  Warnings:

  - You are about to drop the column `comentario` on the `cliente_llamada` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `cliente_llamada` table. All the data in the column will be lost.
  - Added the required column `observacion` to the `cliente_llamada` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cliente_llamada" DROP COLUMN "comentario",
DROP COLUMN "descripcion",
ADD COLUMN     "observacion" TEXT NOT NULL;
