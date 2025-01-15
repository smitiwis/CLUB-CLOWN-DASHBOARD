/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, {
  FC,
  Key,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  Input,
  Select,
  SelectedItems,
  SelectItem,
} from "@nextui-org/react";
import {
  IBClients,
  IBClientsResp,
  IRowClientTable,
} from "@/lib/clients/definitions";
import {
  COLORES,
  ESTADO_LLAMADA_AGENDA,
  GROUPS_CLIENT,
  IColors,
} from "@/constants";
import { useRouter } from "next/navigation";
import IconEdit from "@/components/icons/IconEdit";
import IconEye from "@/components/icons/IconEye";
import IconPhone from "@/components/icons/IconPhone";
import { format, isAfter } from "@formkit/tempo";
import axios from "axios";
import Link from "next/link";
import debounce from "debounce";

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
      label: "ESTADO",
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

            <Button
              isIconOnly
              color="success"
              variant="light"
              size="sm"
              onPress={() =>
                router.push(`/dashboard/lead/editar/${item.id_cliente}`)
              }
            >
              <span className="transform rotate-35">
                <IconEdit />
              </span>
            </Button>
          </div>
        );
      default:
        return cellValue || "-";
    }
  }, []);

  // ======== TABLA Y PAGINACION =========
  const [data, setData] = useState(rows); // Usamos la lista inicial
  const [page, setPage] = useState(clientsResp.page);
  const [isLoading, setIsLoading] = useState(false);

  const limit = clientsResp.limit;

  const pages = React.useMemo(() => {
    return data?.length ? Math.ceil(data.length / limit) : 0;
  }, [data?.length, limit]);

  const loadingState = isLoading ? "loading" : "idle";

  const fetchPageData = async (filter?: { text?: string; status?: string }) => {
    setIsLoading(true);
    const text = filter?.text || "";
    const status = filter?.status || "";

    try {
      const base = `/api/cliente/list?page=1&limit=${limit}`;
      const path = `${base}${text ? `&phoneNumber=${text}` : ""}${
        status ? `&status=${status}` : ""
      }`;

      const response = await axios.get(path);
      setData(adapteRows(response.data.data));
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (page === 1) {
      setData(adapteRows(clientsResp.data));
      return;
    }
    fetchPageData();
  }, [page]);

  // ========= FILTROS =========
  // const [filterPhone, setFilterPhone] = useState("");
  // const [filterStatus, setFilterStatus] = useState<string | undefined>("");
  const [pagination, setPagination] = useState({
    page: clientsResp.page,
    limit: clientsResp.limit,
    total: clientsResp.total,
    totalPages: clientsResp.totalPages,
  });

  const onSearchChange = useCallback(
    debounce(async (text?: string) => {
      if (text && text?.length > 3) {
        fetchPageData({ text });
      }
    }, 1000),
    []
  );

  const onClear = React.useCallback(() => {
    // setFilterPhone("");
    fetchPageData();
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-y-1">
        <div className="flex justify-between gap-3">
          <Input
            isClearable
            type="search"
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por celular..."
            startContent={<i className="icon-search" />}
            // value={filterPhone}
            onClear={onClear}
            onValueChange={(value) => {
              onSearchChange(value);
            }}
          />
          <div className="flex gap-3 w-full sm:max-w-[30%]">
            <Select
              // {...register("estado")}
              items={COLORES}
              placeholder="Estado"
              // isInvalid={!!errors.estado}
              // errorMessage={errors.estado?.message}
              renderValue={(items: SelectedItems<IColors>) => {
                return items.map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <div
                      className="w-[1rem] h-[1rem] rounded-full"
                      style={{ background: item.data?.code }}
                    />
                    <div className="flex flex-col">
                      <span>{item.data?.label}</span>
                    </div>
                  </div>
                ));
              }}
            >
              {(color) => (
                <SelectItem key={color.key} textValue={color.label}>
                  <div className="flex gap-2 items-center">
                    <div
                      className="w-[1rem] h-[1rem] rounded-full"
                      style={{ background: color.code }}
                    />
                    <div className="flex flex-col">
                      <span className="text-small">{color.label}</span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>
            <div>
              <Button
                as={Link}
                href="/dashboard/lead/crear"
                color="primary"
                endContent={<i className="icon-plus" />}
              >
                Agregar lead
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-end my-2">
          <span className="text-default-400 text-small">
            Total {data.length} clientes
          </span>
          <label className="flex gap-x-2 items-center text-default-400 text-small">
            <span>Filas por pagina:</span>
            <div className="w-[70px]">
              <Select
                defaultSelectedKeys={[String(limit)]}
                size="sm"
                items={[
                  { label: "5", key: "5" },
                  { label: "10", key: "10" },
                  { label: "15", key: "15" },
                ]}
              >
                {(document) => (
                  <SelectItem key={document.key} textValue={document.label}>
                    <div className="flex flex-col">
                      <span className="text-small">{document.label}</span>
                    </div>
                  </SelectItem>
                )}
              </Select>
            </div>
          </label>
        </div>
      </div>
    );
  }, [onSearchChange, rows.length]);

  const bottomContent = React.useMemo(() => {
    if (pagination.totalPages === 1 || !data.length) return null;
    return (
      <div className="flex w-full justify-center">
        
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={pagination.page}
          total={pagination.totalPages}
          onChange={(newPage) => setPage(newPage)}
        />
      </div>
    );
  }, [pages, pagination]);

  return (
    <div>
      <Table
        isHeaderSticky
        topContent={topContent}
        topContentPlacement="outside"
        aria-label="Tabla de clientes"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>

        <TableBody
          items={data ?? []}
          loadingContent={<Spinner />}
          loadingState={loadingState}
          emptyContent={"No hay registros para mostrar"}
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
    </div>
  );
};

export default ClientsList;
