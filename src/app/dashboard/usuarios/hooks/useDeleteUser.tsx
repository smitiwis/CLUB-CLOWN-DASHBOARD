import { useActionState, useTransition } from "react";
import { deleteUsuarioById } from "@/lib/usuarios/actions";
import { IStateDeleteUser } from "@/lib/usuarios/definicions";

const useDeleteUser = () => {
  const [loading, startTransaction] = useTransition();
  const [state, formAction] = useActionState<IStateDeleteUser, string>(
    deleteUsuarioById,
    null
  );


  const goToDelete = (id: string) => {
    startTransaction(() => formAction(id));
  };

  return {
    goToDelete,
    loading,
    state,
  };
};

export default useDeleteUser;