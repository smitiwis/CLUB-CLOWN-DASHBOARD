import { fetchClients } from "@/lib/clients/services";
import ClientsList from "../components/ClientsList";
import { Button } from "@nextui-org/react";
import Link from "next/link";

const Page = async () => {
  const pagination = { page: 1, limit: 4 };
  const clientsList = await fetchClients(pagination);
  
  if (clientsList instanceof Error) {
    return <div>Error: {clientsList.message}</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h1>Lista de Leads</h1>
        <Button as={Link} color="primary" href="/dashboard/lead/crear">
          REGISTRAR LEAD
        </Button>
      </div>
      <ClientsList clientsResp={clientsList} />
    </>
  );
};

export default Page;
