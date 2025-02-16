import React from "react";
import { fetchClients } from "@/lib/clients/services";
import FormRegisterCall from "../../components/FormRegisterCall";

export const dynamic = "force-dynamic"; // ⚡ Fuerza renderización en el servidor

const Page = async () => {
  // EVALUAR SOLO OBTENER NUMERO DE CELULARES Y NOMBRES
  // CUANDO ELIJA UN CLIENTE, SE CONSULTARA PARA OBTENER MAS INFORMACION
  const pagination = { page: 1, limit: 20 };
  const clientes = await fetchClients(pagination);
  if (clientes instanceof Error) {
    return <div>Error: {clientes.message}</div>;
  }

  return <FormRegisterCall clientOptions={clientes.data} />;
};

export default Page;