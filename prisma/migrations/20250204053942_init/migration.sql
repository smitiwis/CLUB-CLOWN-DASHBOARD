-- CreateTable
CREATE TABLE "rol" (
    "id_rol" TEXT NOT NULL,
    "nombre" VARCHAR(20) NOT NULL,
    "estado" VARCHAR(1) NOT NULL DEFAULT '1',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" TEXT NOT NULL,
    "id_rol" TEXT NOT NULL,
    "tipo_documento" VARCHAR(1) NOT NULL DEFAULT '',
    "nro_documento" VARCHAR(15) NOT NULL,
    "nombre" VARCHAR(25) NOT NULL,
    "apellido" VARCHAR(40) NOT NULL,
    "telefono" VARCHAR(9) NOT NULL,
    "fecha_ingreso" VARCHAR(10) NOT NULL,
    "direccion" VARCHAR(100) NOT NULL,
    "nro_direccion" VARCHAR(10) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT '1',
    "correo" VARCHAR(60) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id_cliente" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "telefono" VARCHAR(9) NOT NULL,
    "tipo_documento" VARCHAR(1) NOT NULL DEFAULT '',
    "nro_documento" VARCHAR(15),
    "nombre_apo" VARCHAR(25) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,
    "edad" VARCHAR(2) NOT NULL,
    "direccion" VARCHAR(100) NOT NULL,
    "nro_direccion" VARCHAR(10) NOT NULL,
    "origen" VARCHAR(1) NOT NULL DEFAULT '3',
    "grupo" VARCHAR(1) NOT NULL,
    "estado" VARCHAR(1) NOT NULL DEFAULT '3',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "cliente_llamada" (
    "id_cliente_llamada" TEXT NOT NULL,
    "id_cliente" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "estado" VARCHAR(1) NOT NULL DEFAULT '3',
    "observacion" TEXT NOT NULL,
    "tipo" VARCHAR(1) NOT NULL DEFAULT '3',
    "resultado" VARCHAR(1) NOT NULL DEFAULT '1',
    "fecha_agendada" TIMESTAMP(3),
    "estado_agenda" VARCHAR(1) DEFAULT '',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cliente_llamada_pkey" PRIMARY KEY ("id_cliente_llamada")
);

-- CreateTable
CREATE TABLE "taller" (
    "id_taller" TEXT NOT NULL,
    "id_profesor" TEXT NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "dias" VARCHAR(50)[],
    "hora" VARCHAR(20) NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "cant_clases" INTEGER NOT NULL DEFAULT 4,
    "estado" VARCHAR(1) NOT NULL DEFAULT '1',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "taller_pkey" PRIMARY KEY ("id_taller")
);

-- CreateTable
CREATE TABLE "profesor" (
    "id_profesor" TEXT NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellidos" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(15),
    "especialidad" VARCHAR(100),
    "estado" VARCHAR(1) NOT NULL DEFAULT '1',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profesor_pkey" PRIMARY KEY ("id_profesor")
);

-- CreateTable
CREATE TABLE "taller_cliente" (
    "id_taller_cliente" TEXT NOT NULL,
    "id_cliente" TEXT NOT NULL,
    "id_taller" TEXT NOT NULL,
    "id_taller_promocion" TEXT NOT NULL,
    "estado_pago" TEXT NOT NULL DEFAULT 'pago_pend',
    "precio_venta" DOUBLE PRECISION NOT NULL,
    "observacion" TEXT NOT NULL DEFAULT '',
    "estado" VARCHAR(1) NOT NULL DEFAULT '1',
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

-- CreateTable
CREATE TABLE "taller_cliente_pagos" (
    "id_taller_cliente_pago" TEXT NOT NULL,
    "id_taller_cliente" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "img_boucher" TEXT NOT NULL,
    "metodo_pago" VARCHAR(20) NOT NULL,
    "nro_transaccion" VARCHAR(25) NOT NULL DEFAULT '',
    "fecha_pago" TIMESTAMP(3) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "taller_cliente_pagos_pkey" PRIMARY KEY ("id_taller_cliente_pago")
);

-- CreateIndex
CREATE UNIQUE INDEX "rol_nombre_key" ON "rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_nro_documento_key" ON "usuario"("nro_documento");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_telefono_key" ON "usuario"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_telefono_key" ON "cliente"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_nro_documento_key" ON "cliente"("nro_documento");

-- CreateIndex
CREATE INDEX "cliente_telefono_idx" ON "cliente"("telefono");

-- CreateIndex
CREATE INDEX "cliente_llamada_id_cliente_id_usuario_idx" ON "cliente_llamada"("id_cliente", "id_usuario");

-- CreateIndex
CREATE INDEX "taller_id_profesor_idx" ON "taller"("id_profesor");

-- CreateIndex
CREATE UNIQUE INDEX "profesor_email_key" ON "profesor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "taller_cliente_id_cliente_id_taller_key" ON "taller_cliente"("id_cliente", "id_taller");

-- CreateIndex
CREATE INDEX "taller_cliente_pagos_id_taller_cliente_idx" ON "taller_cliente_pagos"("id_taller_cliente");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente_llamada" ADD CONSTRAINT "cliente_llamada_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente_llamada" ADD CONSTRAINT "cliente_llamada_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taller" ADD CONSTRAINT "taller_id_profesor_fkey" FOREIGN KEY ("id_profesor") REFERENCES "profesor"("id_profesor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taller_cliente" ADD CONSTRAINT "taller_cliente_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taller_cliente" ADD CONSTRAINT "taller_cliente_id_taller_fkey" FOREIGN KEY ("id_taller") REFERENCES "taller"("id_taller") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taller_cliente" ADD CONSTRAINT "taller_cliente_id_taller_promocion_fkey" FOREIGN KEY ("id_taller_promocion") REFERENCES "taller_promocion"("id_taller_promocion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taller_cliente_pagos" ADD CONSTRAINT "taller_cliente_pagos_id_taller_cliente_fkey" FOREIGN KEY ("id_taller_cliente") REFERENCES "taller_cliente"("id_taller_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;
