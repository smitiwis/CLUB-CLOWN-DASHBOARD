import React from "react";
import { fetchInscritosOptions } from "@/lib/clients/services";
import FormRegisterPago from "../src/components/FormRegisterPago";

const Page = async () => {
  const clientesInscritos = await fetchInscritosOptions();
  if (clientesInscritos instanceof Error) {
    return <div>Error: {clientesInscritos.message}</div>;
  }
  
  return <FormRegisterPago  inscritosOptions={clientesInscritos} />;
};

export default Page;
