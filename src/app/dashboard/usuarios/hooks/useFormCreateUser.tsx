import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "@/lib/usuarios/schemas";
import { createUsuario } from "@/lib/usuarios/actions";

const useFormCreateUser = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: { name: string }) => {
    const formAction = createUsuario.bind(null, data);
    formAction();
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit
  };
};

export default useFormCreateUser;
