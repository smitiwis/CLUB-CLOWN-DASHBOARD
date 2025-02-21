-- CreateTable
CREATE TABLE "taller_historial" (
    "id_historial" TEXT NOT NULL,
    "id_cliente" TEXT NOT NULL,
    "id_taller_origen" TEXT NOT NULL,
    "id_taller_destino" TEXT NOT NULL,
    "asistencias_previas" INTEGER NOT NULL,
    "fecha_cambio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "taller_historial_pkey" PRIMARY KEY ("id_historial")
);

-- CreateIndex
CREATE INDEX "taller_historial_id_cliente_idx" ON "taller_historial"("id_cliente");

-- AddForeignKey
ALTER TABLE "taller_historial" ADD CONSTRAINT "taller_historial_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taller_historial" ADD CONSTRAINT "taller_historial_id_taller_origen_fkey" FOREIGN KEY ("id_taller_origen") REFERENCES "taller"("id_taller") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taller_historial" ADD CONSTRAINT "taller_historial_id_taller_destino_fkey" FOREIGN KEY ("id_taller_destino") REFERENCES "taller"("id_taller") ON DELETE RESTRICT ON UPDATE CASCADE;
