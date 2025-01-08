import React from "react";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex-1 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h3 className="text-3xl font-semibold mb-2">Bienvenido al Dashboard</h3>
        <p className="text-gray-600">
          Visión general de tu cuenta y actividad.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h4 className="text-xl font-semibold text-gray-800">
            Usuarios Activos
          </h4>
          <p className="text-2xl font-bold text-blue-600">250</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h4 className="text-xl font-semibold text-gray-800">
            Ventas del Mes
          </h4>
          <p className="text-2xl font-bold text-green-600">$2,500</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h4 className="text-xl font-semibold text-gray-800">
            Proyectos Actuales
          </h4>
          <p className="text-2xl font-bold text-yellow-600">5</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
