import { fetchDetailsClient } from "@/lib/clients/services";
import {
  getColor,
  getGrupoCliente,
  getOrigenCliente,
  getResultLlamada,
  getTipeDocument,
  getTipeLlamada,
} from "@/lib/helpers";
import { format } from "@formkit/tempo";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { redirect } from "next/navigation";
import React from "react";
import Breadcrumb from "./Breadcrumb";

type Params = {
  params: Promise<{ id_cliente: string }>;
};

const Page = async ({ params }: Params) => {
  const getParams = await params;
  const { id_cliente } = getParams;
  if (!id_cliente) {
    redirect("/dashboard/leads");
  }
  const cliente = await fetchDetailsClient(id_cliente);
  if (cliente instanceof Error) {
    return <div>Error: {cliente.message}</div>;
  }

  return (
    <>
      <Breadcrumb />

      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-xl text-white">
        {/* Información del Cliente */}
        <CardHeader>
          <h1 className="text-3xl font-extrabold text-gray-200">
            Detalles del Cliente
          </h1>
        </CardHeader>
        <CardBody className="space-y-2">
          <p className="text-lg flex gap-x-2 items-center">
            <strong className="text-gray-400">Estado:</strong>
            <span
              className="w-[1.5rem] h-[1.5rem] rounded-full"
              style={{
                background: getColor(cliente.estado),
              }}
            />
          </p>

          {cliente.telefono && (
            <p className="text-lg flex gap-x-2">
              <strong className="text-gray-400">Teléfono:</strong>
              <span>{cliente.telefono}</span>
            </p>
          )}

          {cliente.origen && (
            <p className="text-lg flex gap-x-2">
              <strong className="text-gray-400">Origen:</strong>
              <span>{getOrigenCliente(cliente.origen)}</span>
            </p>
          )}
          {cliente.nombre_apo && (
            <p className="text-lg flex gap-x-2">
              <strong className="text-gray-400">Nombre del Apoderado:</strong>
              <span>{cliente.nombre_apo}</span>
            </p>
          )}
          {cliente.tipo_documento && (
            <p className="text-lg flex gap-x-2">
              <strong className="text-gray-400">
                {getTipeDocument(cliente.tipo_documento)}:
              </strong>
              <span>{cliente.nro_documento}</span>
            </p>
          )}
          {cliente.nombre && (
            <p className="text-lg flex gap-x-2">
              <strong className="text-gray-400">Nombre:</strong>{" "}
              {cliente.nombre}
              <span>{cliente.apellido}</span>
            </p>
          )}

          {cliente.direccion && (
            <p className="text-lg flex gap-x-2">
              <strong className="text-gray-400">Dirección:</strong>
              <span>{cliente.direccion}</span>
            </p>
          )}
          {cliente.edad && (
            <p className="text-lg flex gap-x-2">
              <strong className="text-gray-400">Edad:</strong>
              <span>{cliente.edad} años</span>
            </p>
          )}
          {cliente.grupo && (
            <p className="text-lg flex gap-x-2">
              <strong className="text-gray-400">Grupo:</strong>
              <span>{getGrupoCliente(cliente.grupo)}</span>
            </p>
          )}
          {cliente.fecha_agendada && (
            <p className="text-lg flex gap-x-2">
              <strong className="text-gray-400">Fecha Agendada:</strong>
              <span>{String(cliente.fecha_agendada)}</span>
            </p>
          )}
          <p className="text-lg flex gap-x-2">
            <strong className="text-gray-400">Total Llamadas:</strong>
            <span>{cliente.cliente_llamada.length || 0}</span>
          </p>

          {/* Detalles de las llamadas */}
          <div>
            <h2 className="text-2xl font-bold text-gray-200 mt-6 mb-4">
              Historial de Llamadas
            </h2>
            {cliente.cliente_llamada.map((llamada) => (
              <div
                key={llamada.id_cliente_llamada}
                className="border rounded-lg p-4 mb-4 shadow-sm"
                style={{
                  borderColor: getColor(llamada.estado),
                  background: "#1f2937",
                }}
              >
                <p className="text-base flex items-center gap-x-2">
                  <strong className="text-gray-400">Estado:</strong>
                  <span
                    className="w-[1rem] h-[1rem] rounded-full"
                    style={{
                      background: getColor(llamada.estado),
                    }}
                  />
                </p>
                <p className="text-base flex gap-x-2">
                  <strong className="text-gray-400">Observación:</strong>
                  <span>{llamada.observacion}</span>
                </p>
                <p className="text-base flex gap-x-2">
                  <strong className="text-gray-400">Tipo:</strong>{" "}
                  {getTipeLlamada(llamada.tipo)}
                </p>
                <p className="text-base flex gap-x-2">
                  <strong className="text-gray-400">Resultado:</strong>
                  <span>{getResultLlamada(llamada.resultado)}</span>
                </p>
                <p className="text-base flex gap-x-2">
                  <strong className="text-gray-400">Fecha:</strong>
                  <span>
                    {format(llamada.fecha_creacion, {
                      date: "medium",
                      time: "short",
                    })}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default Page;
