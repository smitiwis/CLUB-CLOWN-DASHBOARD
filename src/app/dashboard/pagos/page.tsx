import { fetchPagos } from "@/lib/pagos/services";
import React from "react";
import PagosList from "./src/components/PagosList";

const Page = async () => {
  const pagosResp = await fetchPagos({ page: 1, limit: 10 });

  if (pagosResp instanceof Error) {
    return <div>Error fetching data</div>;
  }

  return <PagosList pagosResp={pagosResp} />;
};

export default Page;
