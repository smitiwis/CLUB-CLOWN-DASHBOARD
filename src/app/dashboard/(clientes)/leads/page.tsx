import { fetchClients } from "@/lib/clients/services";
import ClientsList from "../components/ClientsList";
import { fetchUsuariosOptions } from "@/lib/usuarios/services";
import { getUserId } from "@/lib/helpers";

const Page = async () => {
  const myUserId = await getUserId();
  if (!myUserId) {
    return <div>Error: Usuario desconocido</div>;
  }
  const usuarios = await fetchUsuariosOptions();

  const pagination = { page: 1, limit: 10 };
  const clientsList = await fetchClients(pagination);

  if (clientsList instanceof Error) {
    return <div>Error: {clientsList.message}</div>;
  }

  return (
    <ClientsList
      clientsResp={clientsList}
      usuarios={usuarios}
      myUserId={myUserId}
    />
  );
};

export default Page;
