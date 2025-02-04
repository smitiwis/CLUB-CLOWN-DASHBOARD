-- AlterTable
ALTER TABLE "taller_cliente" ADD COLUMN     "id_usuario" TEXT NOT NULL DEFAULT '1';

-- AddForeignKey
ALTER TABLE "taller_cliente" ADD CONSTRAINT "taller_cliente_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
