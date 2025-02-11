"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

const InactivityHandler: React.FC = () => {
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        alert("Tu sesión ha expirado por inactividad.");
        signOut();
      }, 120 * (60 * 1000)); // 30 minutos en milisegundos
    };

    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keydown", resetTimeout);

    resetTimeout(); // Inicializar el temporizador al montar el componente

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keydown", resetTimeout);
    };
  }, []);

  return null;
};

export default InactivityHandler;
