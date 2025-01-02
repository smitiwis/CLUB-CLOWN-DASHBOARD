import { REGEX } from "@/constants/regex";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const { EMAIL, PASSWORD_MIN_LENGTH } = REGEX;

const useFormLogin = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<string | null | undefined>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { correo: "", password: "" },
    resolver: yupResolver<IFormLogin>(schemaLogin),
  });

  const onSubmit = async (formData: IFormLogin) => {
    setState(null);
    setLoading(true);
    
    const response = await signIn("credentials", {
      correo: formData.correo,
      password: formData.password,
      redirect: false,
    });

    if (response?.status === 200) {
      return router.push("/dashboard");
    }
    setState(response?.error);
    setLoading(false);
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    loading,
    setState,
    state,
    // state, // ESTADO DE LA TRANSACCION O CREACION DEL USUARIO
  };
};

export default useFormLogin;

export interface IFormLogin {
  correo: string;
  password: string;
}

export const schemaLogin = yup.object().shape({
  correo: yup
    .string()
    .required("Correo es requerido.")
    .matches(EMAIL, "Correo es inválido.")
    .email("Correo debe ser un email válido."),
  password: yup
    .string()
    .required("Contraseña es requerida.")
    .min(
      PASSWORD_MIN_LENGTH,
      `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`
    )
    .max(100, "La contraseña no puede exceder 100 caracteres."),
});

export type IStateLogin = {
  message?: string;
  field?: "correo" | "password";
  status?: number;
} | null;
