/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { FC, Key, useCallback, useEffect, useState } from "react";
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
  Badge,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import { IBClients, IBClientsResp, IRowClientTable } from "@/lib/clients/definitions";
import { COLORES, ESTADO_LLAMADA_AGENDA, GROUPS_CLIENT } from "@/constants";
import { useRouter } from "next/navigation";
import IconEdit from "@/components/icons/IconEdit";
import IconEye from "@/components/icons/IconEye";
import IconPhone from "@/components/icons/IconPhone";
import { format, isAfter } from "@formkit/tempo";
import axios from "axios";

type Props = {
  clientsResp: IBClientsResp;
};

const ClientsList: FC<Props> = ({ clientsResp }) => {
  const router = useRouter();

  const adapteRows = (clients: IBClients[]) => {
    return clients.map((lead, i) => {
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
  };

  const rows: IRowClientTable[] = adapteRows(clientsResp.data);

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
          <Badge
            color="primary"
            content={
              <Tooltip
                content="Total de llamadas"
                placement="right"
                color="primary"
              >
                <span className="flex p-0 text-xs">
                  {item.nro_llamadas || 0}
                </span>
              </Tooltip>
            }
            variant="shadow"
          >
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
          </Badge>
        );

      case "estadoAgenda":
        const value = ESTADO_LLAMADA_AGENDA.find(
          (status) => status.key === cellValue
        );

        return (
          <div className="flex flex-col">
            {cellValue ? (
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
            ) : (
              "-"
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

  const [data, setData] = useState(rows); // Usamos la lista inicial
  const [page, setPage] = useState(clientsResp.page);
  const [isLoading, setIsLoading] = useState(false);

  const limit = 4;

  const pages = React.useMemo(() => {
    return data?.length ? Math.ceil(data.length / limit) : 0;
  }, [data?.length, limit]);

  const loadingState = isLoading || !data?.length ? "loading" : "idle";

  const fetchPageData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/cliente/list?page=${page}&limit=${limit}`
      );
      setData(adapteRows(response.data.clientsList.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (page === 1) {
      setData(adapteRows(clientsResp.data)); // Si estamos en la primera página, usamos la lista inicial
      return;
    }; // Evitamos volver a cargar si estamos en la primera página
    fetchPageData();
  }, [page]);

  return (
    <Table
      aria-label="Example static collection table"
      selectionMode="none"
      bottomContent={
        pages > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={clientsResp.totalPages}
              onChange={(newPage) => setPage(newPage)}
            />
          </div>
        ) : null
      }
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>

      <TableBody
        items={data ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
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
