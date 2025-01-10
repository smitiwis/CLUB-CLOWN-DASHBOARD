/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { FC, Key, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
  Chip,
  ChipProps,
} from "@nextui-org/react";
import { IBClientRes, IRowClientTable } from "@/lib/clients/definitions";
import { COLORES, GROUPS_CLIENT } from "@/constants";
import { useRouter } from "next/navigation";
import IconEdit from "@/components/icons/IconEdit";
import IconEye from "@/components/icons/IconEye";
import IconPhone from "@/components/icons/IconPhone";
import { format, isAfter } from "@formkit/tempo";

type Props = {
  clientsList: IBClientRes[];
};

const ClientsList: FC<Props> = ({ clientsList }) => {
  const router = useRouter();
  const rows: IRowClientTable[] = clientsList.map((lead, i) => {
    // Formatear la fecha
    const fechaFormateada = lead.fecha_agendada
      ? format(lead.fecha_agendada, { date: "medium", time: "short" })
      : "";

    const isAgendaAfter = lead.fecha_agendada
      ? isAfter(lead.fecha_agendada, new Date())
        ? true
        : false
      : false;

    return {
      ...lead,
      key: String(i + 1),
      fecha_agendada: fechaFormateada,
      isAfter: isAgendaAfter,
    };
  });

  const columns = [
    {
      key: "estado",
      label: "COLOR",
    },
    {
      key: "fecha_agendada",
      label: "AGENDA",
    },
    {
      key: "telefono",
      label: "CELULAR",
    },
    {
      key: "nombre",
      label: "NOMBRE",
    },
    {
      key: "apellido",
      label: "APELLIDO",
    },
    {
      key: "edad",
      label: "EDAD",
    },
    {
      key: "grupo",
      label: "GRUPO",
    },

    { key: "actions", label: "ACTIONS" },
  ];

  const statusColorGroup: Record<string, ChipProps["color"]> = {
    "1": "primary",
    "2": "secondary",
    "3": "warning",
  };

  const renderCell = useCallback((item: IRowClientTable, columnKey: Key) => {
    const cellValue = item[columnKey as keyof IRowClientTable];

    switch (columnKey) {
      case "estado":
        const color = COLORES.find((color) => color.key === cellValue);
        return (
          <div
            className="w-[.5rem] h-[.5rem] rounded-full"
            style={{ background: color?.code || "white" }}
          />
        );

      case "fecha_agendada":
        return (
          <div className="flex flex-col">
            {cellValue && (
              <Chip
                color={item.isAfter ? "success" : "danger"}
                variant="shadow"
              >
                {cellValue}
              </Chip>
            )}
          </div>
        );

      case "status":
        return (
          <div className="flex flex-col">
            <span className="text-small">{cellValue}</span>
          </div>
        );

      case "edad":
        return (
          <div className="flex flex-col">
            <span className="text-small">
              {cellValue} {cellValue ? "años" : "-"}
            </span>
          </div>
        );

      case "grupo":
        const grupo = GROUPS_CLIENT.find((group) => group.key === cellValue);
        return (
          <div className="flex flex-col">
            {grupo && (
              <Chip
                className="capitalize"
                color={statusColorGroup[item.grupo]}
                size="sm"
                variant="flat"
              >
                {grupo?.label}
              </Chip>
            )}
            {!grupo && "-"}
          </div>
        );

      case "actions":
        return (
          <div className="relative flex items-center gap-x-2">
            <Tooltip content="Llamar" color="primary">
              <Button
                isIconOnly
                color="primary"
                variant="light"
                size="sm"
                onPress={() =>
                  router.push(`/dashboard/llamar/${item.id_cliente}/registrar`)
                }
              >
                <IconPhone />
              </Button>
            </Tooltip>

            <Tooltip content="Detalles" color="success">
              <Button
                isIconOnly
                color="success"
                variant="light"
                size="sm"
                onPress={() =>
                  router.push(`/dashboard/lead/detalle/${item.id_cliente}`)
                }
              >
                <IconEye />
              </Button>
            </Tooltip>

            <Tooltip content="Editar">
              <Button
                isIconOnly
                color="success"
                variant="light"
                size="sm"
                onPress={() =>
                  router.push(`/dashboard/lead/editar/${item.id_cliente}`)
                }
              >
                <IconEdit />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue || "-";
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

export default ClientsList;
