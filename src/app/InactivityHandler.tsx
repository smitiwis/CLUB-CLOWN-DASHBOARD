/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { FC, useEffect } from "react";
import { signOut } from "next-auth/react";
import { getSession } from "next-auth/react";

const InactivityHandler: FC = () => {

  const inactivityHandler = () => {
    let timeout: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        alert("Tu sesión ha expirado por inactividad.");
        signOut();
      }, 120 * (60 * 1000));  // 2 HORAS
    };

    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keydown", resetTimeout);

    resetTimeout(); // Inicializar el temporizador al montar el componente

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keydown", resetTimeout);
    };
  };

  const verificarSesion = async () => {
    const session = await getSession();
    if (!session) {
      return await signOut();
    }
    return inactivityHandler();
  };

  useEffect(() => {
    verificarSesion();
  }, []);

  return null;
};

export default InactivityHandler;
