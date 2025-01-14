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
import { COLORES, ESTADO_LLAMADA_AGENDA, GROUPS_CLIENT } from "@/constants";
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
    const isAgendaAfter =
      lead.llamada && lead.llamada.estado_agenda === "1"
        ? isAfter(new Date(), new Date(String(lead.llamada.fecha_agendada)))
          ? true
          : false
        : false;

    return {
      ...lead,
      key: String(i + 1),
      estadoAgenda: lead.llamada
        ? isAgendaAfter && lead.llamada.estado_agenda === "1"
          ? "3"
          : lead.llamada.estado_agenda
        : "",
      fechaAgendada:
        lead.llamada && lead.llamada.fecha_agendada
          ? format(new Date(String(lead.llamada.fecha_agendada)), {
              date: "medium",
              time: "short",
            })
          : null,
    };
  });
  const columns = [
    {
      key: "estado",
      label: "COLOR",
    },
    {
      key: "estadoAgenda",
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

  const statusColorAgenda: Record<string, ChipProps["color"]> = {
    "1": "warning",
    "2": "success",
    "3": "danger",
  };

  const renderCell = useCallback((item: IRowClientTable, columnKey: Key) => {
    const cellValue = item[columnKey as keyof IRowClientTable];

    switch (columnKey) {
      case "estado":
        const color = COLORES.find((color) => color.key === cellValue);
        return (
          <Tooltip
            showArrow
            classNames={{
              base: ["before:bg-neutral-400 dark:before:bg-white"],
              content: [
                "py-2 px-4 shadow-xl",
                "text-black bg-gradient-to-br from-white to-neutral-400",
              ],
            }}
            content={color?.label}
            placement="right"
          >
            <div
              className="w-[1.75rem] h-[1.75rem] rounded-full"
              style={{ background: color?.code || "white" }}
            />
          </Tooltip>
        );

      case "estadoAgenda":
        const value = ESTADO_LLAMADA_AGENDA.find(
          (status) => status.key === cellValue
        );

        return (
          <div className="flex flex-col">
            {cellValue && (
              <Tooltip
                isDisabled={item.estadoAgenda === "2"}
                content={item.fechaAgendada}
                placement="right"
                showArrow
                classNames={{
                  base: ["before:bg-neutral-400 dark:before:bg-white"],
                  content: [
                    "py-2 px-4 shadow-xl",
                    "text-black bg-gradient-to-br from-white to-neutral-400",
                  ],
                }}
              >
                <Chip color={statusColorAgenda[cellValue]} variant="light">
                  {value?.label}
                </Chip>
              </Tooltip>
            )}
          </div>
        );

      case "status":
        return (
          <div className="flex flex-col">
            <span className="text-small">{item.estado}</span>
          </div>
        );

      case "edad":
        return (
          <div className="flex flex-col">
            <span className="text-small">
              {item.edad} {cellValue ? "años" : "-"}
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
