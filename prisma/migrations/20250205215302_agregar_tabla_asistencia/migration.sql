-- CreateTable
CREATE TABLE "taller_asistencia" (
    "id_asistencia" TEXT NOT NULL,
    "id_taller_cliente" TEXT NOT NULL,
    "fecha_asistencia" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" VARCHAR(1) NOT NULL DEFAULT '1',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "taller_asistencia_pkey" PRIMARY KEY ("id_asistencia")
);

-- CreateIndex
CREATE INDEX "taller_asistencia_id_taller_cliente_idx" ON "taller_asistencia"("id_taller_cliente");

-- AddForeignKey
ALTER TABLE "taller_asistencia" ADD CONSTRAINT "taller_asistencia_id_taller_cliente_fkey" FOREIGN KEY ("id_taller_cliente") REFERENCES "taller_cliente"("id_taller_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;
