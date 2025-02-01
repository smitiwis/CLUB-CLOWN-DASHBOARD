import { prisma } from "@/lib/prisma";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const Page = async () => {
  const inscripciones = await prisma.taller_cliente.findMany({
    orderBy: {
      fecha_inscripcion: "desc", // Ordena de más reciente a más antiguo
    },
    select: {
      id_taller_cliente: true,
      estado_pago: true,
      precio_venta: true,
      cliente: {
        select: {
          id_cliente: true,
          nombre: true,
          apellido: true,
        },
      },
      taller: {
        select: {
          id_taller: true,
          nombre: true,
        },
      },
      taller_promocion: {
        select: {
          id_taller_promocion: true,
          nombre: true,
          descuento: true,
        },
      },
      taller_cliente_pagos: {
        select: {
          id_taller_cliente_pago: true,
          monto: true,
          metodo_pago: true,
          img_boucher: true,
          fecha_pago: true,
        },
      },
    },
  });
  console.log(inscripciones);


  return (
    <Button as={Link} href="/dashboard/inscripciones/registrar">
      Inscribir nuevo alumno
    </Button>
  );
};

export default Page;
