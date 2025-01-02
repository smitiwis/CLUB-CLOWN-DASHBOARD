import { fetchClients } from "@/lib/clients/services";
import ButtonCreate from "./components/ButtonCreate";
import ClientsList from "./components/ClientsList";

const Page = async () => {
  const clientsList = await fetchClients();

  return (
    <>  
      <div className="flex justify-between items-center mb-3">
        <h1>Lista de Leads</h1>
        <ButtonCreate />
      </div>
      <ClientsList clientsList={clientsList} />
    </>
  );
};

export default Page;
