/*
  Warnings:

  - Added the required column `fecha_pago` to the `taller_cliente_pagos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_boucher` to the `taller_cliente_pagos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_pago` to the `taller_cliente_pagos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "taller_cliente_pagos" ADD COLUMN     "estado_pago" VARCHAR(15) NOT NULL DEFAULT 'pendiente',
ADD COLUMN     "fecha_pago" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "img_boucher" TEXT NOT NULL,
ADD COLUMN     "tipo_pago" VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE INDEX "taller_cliente_pagos_id_taller_cliente_idx" ON "taller_cliente_pagos"("id_taller_cliente");
