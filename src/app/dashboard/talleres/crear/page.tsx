import { fetchProfesores } from "@/lib/profesores/services";
import FormCreateTaller from "../(resources)/components/FormCreateTaller";

const Page = async () => {
  const paginacion = { page: 1, limit: 20 };
  const profesores = await fetchProfesores(paginacion);

  if (profesores instanceof Error) {
    return <div>Error: {profesores.message}</div>;
  }
  
  if (!profesores) {
    return <div>Loading...</div>;
  }

  const profesoresOptions = profesores.data.map((profesor) => ({
    key: profesor.id_profesor,
    label: profesor.nombre + " " + profesor.apellidos,
  }));

  return <FormCreateTaller profesoresOptions = {profesoresOptions}/>
};

export default Page;
