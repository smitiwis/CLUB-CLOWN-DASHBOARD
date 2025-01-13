/*
  Warnings:

  - You are about to drop the column `fecha_agendada` on the `cliente` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cliente" DROP COLUMN "fecha_agendada";

-- AlterTable
ALTER TABLE "cliente_llamada" ADD COLUMN     "agenda_atendida" VARCHAR(1) NOT NULL DEFAULT '3',
ADD COLUMN     "fecha_agendada" TIMESTAMP(3);
