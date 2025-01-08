/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import IconEdit from "@/components/icons/IconEdit";
import IconEye from "@/components/icons/IconEye";
import { COLORES, RESULTADO_LLAMADAS, TIPO_LLAMADAS } from "@/constants";
import { IBClientCallRes } from "@/lib/llamadas/definitions";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { FC, Key, useCallback } from "react";

type Props = {
  callsList: IBClientCallRes[];
};

const CallsList: FC<Props> = ({ callsList }) => {
  const router = useRouter();
  const rows = callsList;

  const columns = [
    {
      key: "cliente",
      label: "LEAD",
    },
    {
      key: "estado",
      label: "COLOR",
    },
    {
      key: "observacion",
      label: "OBSERVACION",
    },
    {
      key: "tipo",
      label: "TIPO",
    },
    {
      key: "resultado",
      label: "RESULTADO",
    },
    {
      key: "fecha_creacion",
      label: "FECHA REGISTRO",
    },

    { key: "actions", label: "ACTIONS" },
  ];

  const renderCell = useCallback((item: IBClientCallRes, columnKey: Key) => {
    const cellValue = item[columnKey as keyof IBClientCallRes];

    switch (columnKey) {
      case "cliente":
        return (
          <div className="flex flex-col">
            <span className="text-small">{item.cliente.nombre}</span>
            <span className="text-small">{item.cliente.telefono}</span>
          </div>
        );
      case "estado":
        const color = COLORES.find((color) => color.key === cellValue);
        return (
          <div
            className="w-[.5rem] h-[.5rem] rounded-full"
            style={{ background: color?.code || "white" }}
          />
        );

      case "tipo":
        return (
          <div className="flex flex-col">
            <span className="text-small">
              {TIPO_LLAMADAS.find((tipo) => tipo.key === cellValue)?.label}
            </span>
          </div>
        );

      case "resultado":
        return (
          <div className="flex flex-col">
            <span className="text-small">
              {RESULTADO_LLAMADAS.find((res) => res.key === cellValue)?.label}
            </span>
          </div>
        );

      case "actions":
        return (
          <div className="relative flex items-center gap-x-2">
            <Tooltip content="Detalles" color="success">
              <Button
                isIconOnly
                color="success"
                variant="light"
                size="sm"
                onPress={() =>
                  router.push(
                    `/dashboard/llamada/detalle/${item.id_cliente_llamada}`
                  )
                }
              >
                <IconEye />
              </Button>
            </Tooltip>

            <Tooltip content="Editar" color="default">
              <Button
                isIconOnly
                color="success"
                variant="light"
                size="sm"
                onPress={() =>
                  router.push(
                    `/dashboard/llamada/editar/${item.id_cliente_llamada}`
                  )
                }
              >
                <IconEdit />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return typeof cellValue === "object"
          ? JSON.stringify(cellValue)
          : cellValue || "-";
    }
  }, []);

  return (
    <Table aria-label="Example static collection table" selectionMode="none">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>

      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default CallsList;
