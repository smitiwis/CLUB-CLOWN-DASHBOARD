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
  const tallerDetail = await fetchAlumnosByTallerId(id_taller);
  if (tallerDetail instanceof Error) {
    return <div>Error al cargar los alumnos</div>;
  }

  return (
    <div className="flex flex-col items-center mt-5 w-full gap-6">
      <h1 className="text-xl">
        {tallerDetail.tallerName?.toLocaleUpperCase()}
      </h1>
      <RegistrarAsistencia fetchAlumnos={tallerDetail.alumnos} />
    </div>
  );
};

export default Page;
