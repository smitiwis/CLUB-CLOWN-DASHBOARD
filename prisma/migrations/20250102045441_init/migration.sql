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

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id_cliente")
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
