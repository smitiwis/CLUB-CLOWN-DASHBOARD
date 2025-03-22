import { fetchTalleresOptions } from "@/lib/talleres/services";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Link,
} from "@heroui/react";
import React from "react";

export const dynamic = "force-dynamic"; // ⚡ Fuerza renderización en el servidor

const Page = async () => {
  const talleresData = await fetchTalleresOptions();

  if (talleresData instanceof Error) {
    return <div>Error al cargar las llamadas</div>;
  }

  return (
    <div>
      <h1 className="mx-auto text-lg mt-5 mb-8 w-[fit-content] border-b-1 border-gray-400">
        LISTA DE TALLER PARA SISTENCIA
      </h1>
      <div className="w-full flex flex-wrap gap-4">
        {talleresData.map((taller) => (
          <Link
            key={taller.id_taller}
            href={`/dashboard/asistencia/taller/${taller.id_taller}`}
          >
            <Badge color="primary" size="lg" content={taller.inscritos}>
              <Card
                className="border border-gray-800"
                shadow="md"
                isHoverable
                isPressable
              >
                <CardHeader className="flex gap-3">
                  <div className="flex flex-col items-start gap-y-1">
                    <p className="text-md">
                      {taller.nombre.toLocaleUpperCase()}
                    </p>
                    <p className="text-small text-default-500">
                      Prof. {taller.profesor.nombre} {taller.profesor.apellidos}
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="flex flex-col text-sm">
                    <span className="flex gap-x-2">
                      <b>Precio:</b> S/{taller.precio.toFixed(2)}
                    </span>
                    <span className="flex gap-x-2">
                      <b>Clases:</b> {taller.cant_clases}
                    </span>
                    <span className="flex gap-x-2">
                      <b>D{taller.dias.length === 1 ? "ía" : "ias"}:</b>
                      <div className="flex gap-x-1 items-center">
                        {taller.dias.map((dia) => (
                          <Chip
                            key={dia}
                            color="primary"
                            variant="flat"
                            size="sm"
                          >
                            {dia}
                          </Chip>
                        ))}
                      </div>
                    </span>
                    <span className="flex gap-x-2">
                      <b>Hora:</b> {taller.hora}
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
