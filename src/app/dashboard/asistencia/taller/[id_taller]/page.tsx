import { fetchAlumnosByTallerId } from "@/lib/talleres/services";
import { redirect } from "next/navigation";
import React from "react";
import RegistrarAsistencia from "../../src/components/RegistrarAsistencia";

type Params = {
  params: Promise<{ id_taller: string }>;
};

const Page = async ({ params }: Params) => {
  const { id_taller } = await params;
  if (!id_taller) {
    redirect("/dashboard/asistencia");
  }
  const alumnos = await fetchAlumnosByTallerId(id_taller);

  if (alumnos instanceof Error) {
    return <div>Error al cargar los alumnos</div>;
  }

  return <RegistrarAsistencia fetchAlumnos={alumnos} />;
};

export default Page;
