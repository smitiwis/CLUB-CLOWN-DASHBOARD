import React from "react";
import { fetchInscritosOptions } from "@/lib/clients/services";
import FormRegisterPago from "../src/components/FormRegisterPago";

export const dynamic = "force-dynamic"; // ⚡ Fuerza renderización en el servidor

const Page = async () => {
  const clientesInscritos = await fetchInscritosOptions();
  if (clientesInscritos instanceof Error) {
    return <div>Error: {clientesInscritos.message}</div>;
  }
  
  return <FormRegisterPago  inscritosOptions={clientesInscritos} />;
};

export default Page;
