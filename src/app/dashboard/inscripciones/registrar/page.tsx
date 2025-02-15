import React from "react";
import FormRegisterInscripcion from "../resources/components/FormRegisterInscripcion";
import { fetchClientsOptions } from "@/lib/clients/services";
import { fetchTalleresOptions } from "@/lib/talleres/services";
import { fetchPromocionesOptions } from "@/lib/promociones/services";

export const dynamic = "force-dynamic"; // ⚡ Fuerza renderización en el servidor

const Page = async () => {
  const clientes = await fetchClientsOptions();
  if (clientes instanceof Error) {
    return <div>Error: {clientes.message}</div>;
  }
  
  const talleres = await fetchTalleresOptions();
  if (talleres instanceof Error) {
    return <div>Error: {talleres.message}</div>;
  }

  const promociones = await fetchPromocionesOptions();
  if (promociones instanceof Error) {
    return <div>Error: {promociones.message}</div>;
  }

  return (
    <FormRegisterInscripcion
      clientOptions={clientes}
      talleresOptions={talleres}
      promocionesOptions={promociones}
    />
  );
};

export default Page;
