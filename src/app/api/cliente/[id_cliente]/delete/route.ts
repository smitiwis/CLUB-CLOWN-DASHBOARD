import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

type params = {
  params: Promise<{ id_cliente: string }>;
};

export async function DELETE(request: NextRequest, { params }: params) {
  try {
    const id_cliente = (await params).id_cliente;

    if (!id_cliente) {
      return Response.json(
        { mensaje: "ID de cliente inválido" },
        { status: 400 }
      );
    }

    await prisma.cliente.delete({ where: { id_cliente } });

    return Response.json({ mensaje: `Eliminando con existo`, status: 200 });
  } catch (error) {
    console.error("Error al eliminar cliente", error);
    return Response.json(
      { mensaje: "No se peude eliminar el cliente, tiene llamadas registradas" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
