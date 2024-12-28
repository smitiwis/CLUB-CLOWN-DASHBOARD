import { fetchLeads } from "@/lib/leads/data/data";
import LeadsList from "./components/LeadsList";
import ButtonCreate from "./components/ButtonCreate";

const page = async () => {
  const leadsList = await fetchLeads();

  return (
    <>  
      <div className="flex justify-between items-center mb-3">
        <h1>Lista de Leads</h1>
        <ButtonCreate />
      </div>
      <LeadsList leadsList={leadsList} />
    </>
  );
};

export default page;
