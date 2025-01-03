-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" TEXT NOT NULL,
    "nombre" VARCHAR(25) NOT NULL,
    "apellido" VARCHAR(40) NOT NULL,
    "telefono" VARCHAR(9) NOT NULL,
    "dni" VARCHAR(8) NOT NULL,
    "fecha_ingreso" VARCHAR(10) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT '1',
    "correo" VARCHAR(60) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id_cliente" TEXT NOT NULL,
    "telefono" VARCHAR(9) NOT NULL,
    "nombre_apo" VARCHAR(25) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,
    "edad" VARCHAR(2) NOT NULL,
    "grupo" VARCHAR(1) NOT NULL,
    "estado" VARCHAR(1) NOT NULL DEFAULT '3',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" TEXT NOT NULL,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "cliente_llamada" (
    "id_cliente_llamada" TEXT NOT NULL,
    "id_cliente" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "estado" VARCHAR(1) NOT NULL DEFAULT '3',
    "descripcion" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cliente_llamada_pkey" PRIMARY KEY ("id_cliente_llamada")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_telefono_key" ON "usuario"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_dni_key" ON "usuario"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_telefono_key" ON "cliente"("telefono");

-- CreateIndex
CREATE INDEX "cliente_telefono_idx" ON "cliente"("telefono");

-- CreateIndex
CREATE INDEX "cliente_llamada_id_cliente_id_usuario_idx" ON "cliente_llamada"("id_cliente", "id_usuario");

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente_llamada" ADD CONSTRAINT "cliente_llamada_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente_llamada" ADD CONSTRAINT "cliente_llamada_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
