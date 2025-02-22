// app/api/export-data/route.ts
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import {
  getGrupoCliente,
  getLabelCategoryByKey,
  getOrigenCliente,
  getTipeDocument,
  getUserId,
} from "@/lib/helpers";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { format } from "@formkit/tempo";

type params = {
  params: Promise<{ id_usuario: string }>;
};

export async function GET(request: NextRequest, { params }: params) {
  try {
    const id_usuario = (await params).id_usuario || (await getUserId());

    if (!id_usuario) {
      return Response.json(
        { mensaje: "ID de cliente inválido" },
        { status: 400 }
      );
    }
    const searchParams = request.nextUrl.searchParams;
    const phoneNumber = (searchParams.get("phoneNumber") || "")
      .replace(/\s+/g, "")
      .trim(); // Número de celular (opcional)
    const status = searchParams.get("status") || ""; // Estado (opcional)

    const where: {
      id_usuario: string;
      telefono?: { contains: string };
      estado?: string;
    } = { id_usuario };

    if (phoneNumber) {
      where.telefono = { contains: phoneNumber }; // Filtra por número parcial o completo
    }

    if (status) {
      where.estado = status;
    }

    const clientes = await prisma.cliente.findMany({
      where: {
        ...where,
        id_usuario: id_usuario !== "all" ? id_usuario : undefined,
      },
      orderBy: { fecha_creacion: "desc" },
      select: {
        usuario: {
          select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
          },
        },
        id_cliente: true,
        telefono: true,
        nombre_apo: true,
        nombre: true,
        apellido: true,
        edad: true,
        grupo: true,
        estado: true,
        tipo_documento: true,
        nro_documento: true,
        direccion: true,
        nro_direccion: true,
        categoria: true,
        origen: true,
        fecha_creacion: true,
        cliente_llamada: {
          select: {
            id_cliente_llamada: true,
            estado_agenda: true,
            fecha_agendada: true,
          },
        },
      },
    });

    if (!clientes) {
      throw new Error("No se encontraron leads.");
    }

    // =======================

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Datos");

    // Definir las columnas
    worksheet.columns = [
      { header: "TELEFONO", key: "telefono", width: 10 },
      { header: "NOMBRE", key: "nombre", width: 30 },
      { header: "APELLIDO", key: "apellido", width: 20 },
      { header: "EDAD", key: "edad", width: 10 },
      { header: "GRUPO", key: "grupo", width: 20 },
      { header: "ESTADO", key: "estado", width: 10 },
      { header: "TIPO DOCUMENTO", key: "tipo_documento", width: 20 },
      { header: "NRO DOCUMENTO", key: "nro_documento", width: 20 },
      { header: "CATEGORIA", key: "categoria", width: 20 },
      { header: "ORIGEN", key: "origen", width: 20 },
      { header: "FECHA REGISTRO", key: "fecha_registro", width: 20 },
    ];

    // Agregar filas de datos (ejemplo estático)
    const clientesList = clientes.map((cliente) => {
      return {
        telefono: cliente.telefono,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        edad: String(cliente.edad),
        grupo: getGrupoCliente(cliente.grupo),
        estado: cliente.estado ? "Activo" : "Inactivo",
        tipo_documento: getTipeDocument(cliente.tipo_documento),
        nro_documento: String(cliente.nro_documento || "") ,
        categoria: getLabelCategoryByKey(cliente.categoria),
        origen: getOrigenCliente(cliente.origen),
        fecha_registro: format(cliente.fecha_creacion, { date: "short" }),
      };
    });

    clientesList.forEach((cliente) => {
      worksheet.addRow(cliente);
    });

    // Generar el archivo Excel en un buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Crear una respuesta con el buffer y los encabezados adecuados
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": "attachment; filename=datos.xlsx",
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Error al generar el archivo Excel:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error al generar el archivo Excel" }),
      { status: 500 }
    );
  }
}
