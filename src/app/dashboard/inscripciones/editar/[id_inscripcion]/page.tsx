import { fetchInscripcionById } from "@/lib/inscripciones/services";
import React from "react";
import FormEditInscripcion from "../../resources/components/FormEditInscripcion";
import { redirect } from "next/navigation";
import { fetchClientsOptions } from "@/lib/clients/services";
import { fetchTalleresOptions } from "@/lib/talleres/services";
import { fetchPromocionesOptions } from "@/lib/promociones/services";
import { fetchUsuariosOptions } from "@/lib/usuarios/services";

type Params = {
  params: Promise<{ id_inscripcion: string }>;
};

const Page = async ({ params }: Params) => {
  const { id_inscripcion } = await params;

  const inscripcion = await fetchInscripcionById(id_inscripcion);

  if (!inscripcion) {
    return <div>inscripcion not found</div>;
  }

  if (inscripcion instanceof Error) {
    return redirect("/dashboard/inscripciones");
  }

  const clientes = await fetchClientsOptions();
  if (clientes instanceof Error) {
    return <h1>Error al obtener Clientes</h1>;
  }

  const talleres = await fetchTalleresOptions();
  if (talleres instanceof Error) {
    return <h1>Error al obtener talleres</h1>;
  }

  const promociones = await fetchPromocionesOptions();
  if (promociones instanceof Error) {
    return <h1>Error al obtener promociones</h1>;
  }

  const usuarios = await fetchUsuariosOptions();
  if (usuarios instanceof Error) {
    return <h1>Error al obtener usuarios</h1>;
  }

  console.log(inscripcion);

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-400 mb-4">
        Actualizar Inscripción {id_inscripcion}
      </h1>
      <FormEditInscripcion
        inscripcion={inscripcion}
        clientes={clientes}
        talleres={talleres}
        promociones={promociones}
        usuarios={usuarios}
      />
    </>
  );
};

export default Page;
