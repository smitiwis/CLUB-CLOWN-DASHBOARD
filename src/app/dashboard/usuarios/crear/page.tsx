import { fetchRoles } from "@/lib/roles/services";
import FormCreateUser from "../components/FormCreateUser";

export const dynamic = 'force-dynamic';

const Page = async () => {
  const getRoles = await fetchRoles();

  const roles = getRoles.map(({ id_rol, nombre, estado }, i) => ({
    key: i,
    rolId: id_rol,
    label: nombre,
    estado: !!parseInt(estado),
  }));

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-400 mb-4">
        Crear Usuario
      </h1>
      <FormCreateUser roles={roles} />
    </>
  );
};

export default Page;
