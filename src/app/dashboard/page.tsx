import React from "react";

import { Card, CardBody, CardHeader, Chip, Divider } from "@nextui-org/react";
import { fetchStateCalls } from "@/lib/llamadas/services";

const Dashboard = async () => {
  const algo  = await fetchStateCalls();

  if (algo instanceof Error || !algo) {
    return <div>Error al obtener datos</div>;
  }

  const { llamadasHoy, totalLlamadas } = algo;

  return (
    <div className="flex-1" >
      <div className="bg-gray-800 p-6 rounded-lg  mb-6 ">
        <h3 className="text-3xl font-semibold mb-2">
          Bienvenido Club Clown Perú
        </h3>
        <p className="text-gray-300">
          Resumen general de las actividades de la empresa.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card isHoverable shadow="md">
          <CardHeader className="flex flex-col items-start">
            <h4 className="text-xl font-semibold text-gray-300 mb-3">
              Llamadas Realizadas
            </h4>
            <Divider />
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-y-2">
              <Chip
                className="text-xl"
                variant="light"
                color={
                  llamadasHoy < 20
                    ? "danger"
                    : llamadasHoy > 46
                    ? "warning"
                    : "success"
                }
              >
                Hoy: {llamadasHoy}
              </Chip>
              <Chip className="text-xl" variant="light">
                Total: {totalLlamadas}
              </Chip>
            </div>
          </CardBody>
        </Card>
        <Card isHoverable shadow="md">
          <CardHeader className="flex flex-col items-start">
            <h4 className="text-xl font-semibold text-gray-300 mb-3">
              Llamadas Realizadas
            </h4>
            <Divider />
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-y-2">
              <Chip
                className="text-xl"
                variant="light"
                color={
                  llamadasHoy < 20
                    ? "danger"
                    : llamadasHoy > 46
                    ? "warning"
                    : "success"
                }
              >
                Hoy: {llamadasHoy}
              </Chip>
              <Chip className="text-xl" variant="light">
                Total: {totalLlamadas}
              </Chip>
            </div>
          </CardBody>
        </Card>
        <Card isHoverable shadow="md">
          <CardHeader className="flex flex-col items-start">
            <h4 className="text-xl font-semibold text-gray-300 mb-3">
              Llamadas Realizadas
            </h4>
            <Divider />
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-y-2">
              <Chip
                className="text-xl"
                variant="light"
                color={
                  llamadasHoy < 20
                    ? "danger"
                    : llamadasHoy > 46
                    ? "warning"
                    : "success"
                }
              >
                Hoy: {llamadasHoy}
              </Chip>
              <Chip className="text-xl" variant="light">
                Total: {totalLlamadas}
              </Chip>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
