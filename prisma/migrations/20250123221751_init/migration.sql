-- CreateTable
CREATE TABLE "taller_cliente_pagos" (
    "id_taller_cliente_pago" TEXT NOT NULL,
    "id_taller_cliente" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "taller_cliente_pagos_pkey" PRIMARY KEY ("id_taller_cliente_pago")
);

-- AddForeignKey
ALTER TABLE "taller_cliente_pagos" ADD CONSTRAINT "taller_cliente_pagos_id_taller_cliente_fkey" FOREIGN KEY ("id_taller_cliente") REFERENCES "taller_cliente"("id_taller_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;
