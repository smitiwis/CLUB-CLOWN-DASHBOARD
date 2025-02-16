import React from "react";
import InscritoList from "./resources/components/InscritoList";
import { fetchInscripciones } from "@/lib/inscripciones/services";

export const dynamic = "force-dynamic"; // ⚡ Fuerza renderización en el servidor

const Page = async () => {
  const response = await fetchInscripciones({ page: 1, limit: 10 });

  if (response instanceof Error) {
    return <div>Error fetching inscritos</div>;
  }
  return <InscritoList inscripcionesResp={response} />;
};

export default Page;
