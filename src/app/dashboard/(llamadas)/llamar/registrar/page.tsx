import React from "react";
import { fetchClients } from "@/lib/clients/services";
import FormRegisterCall from "../../components/FormRegisterCall";

const Page = async () => {
  const clientes = await fetchClients();
  if (clientes instanceof Error) {
    return <div>Error: {clientes.message}</div>;
  }

  return <FormRegisterCall clientOptions={clientes} />;
};

export default Page;