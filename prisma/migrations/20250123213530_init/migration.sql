-- CreateTable
CREATE TABLE "taller_cliente" (
    "id_taller_cliente" TEXT NOT NULL,
    "id_cliente" TEXT NOT NULL,
    "id_taller" TEXT NOT NULL,
    "id_taller_promocion" TEXT NOT NULL,
    "fecha_inscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "taller_cliente_pkey" PRIMARY KEY ("id_taller_cliente")
);

-- CreateTable
CREATE TABLE "taller_promocion" (
    "id_taller_promocion" TEXT NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descuento" DOUBLE PRECISION NOT NULL,
    "detalles" TEXT NOT NULL,
    "estado" VARCHAR(1) NOT NULL DEFAULT '1',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "taller_promocion_pkey" PRIMARY KEY ("id_taller_promocion")
);

-- CreateIndex
CREATE UNIQUE INDEX "taller_cliente_id_cliente_id_taller_key" ON "taller_cliente"("id_cliente", "id_taller");

-- AddForeignKey
ALTER TABLE "taller_cliente" ADD CONSTRAINT "taller_cliente_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taller_cliente" ADD CONSTRAINT "taller_cliente_id_taller_fkey" FOREIGN KEY ("id_taller") REFERENCES "taller"("id_taller") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taller_cliente" ADD CONSTRAINT "taller_cliente_id_taller_promocion_fkey" FOREIGN KEY ("id_taller_promocion") REFERENCES "taller_promocion"("id_taller_promocion") ON DELETE RESTRICT ON UPDATE CASCADE;
