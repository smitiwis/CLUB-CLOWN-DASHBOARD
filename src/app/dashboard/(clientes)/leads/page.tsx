import { fetchClients } from "@/lib/clients/services";
import ClientsList from "../components/ClientsList";

const Page = async () => {
  const pagination = { page: 1, limit: 10 };
  const clientsList = await fetchClients(pagination);

  if (clientsList instanceof Error) {
    return <div>Error: {clientsList.message}</div>;
  }

  return <ClientsList clientsResp={clientsList} />;
};

export default Page;
