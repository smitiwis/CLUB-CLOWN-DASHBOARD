/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import IconEdit from "@/components/icons/IconEdit";
import IconEye from "@/components/icons/IconEye";
import { REGEX } from "@/constants/regex";
import { IBPago, IBPagoResp } from "@/lib/pagos/definicions";
import { format } from "@formkit/tempo";
import {
  Avatar,
  Button,
  Chip,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import axios from "axios";
import debounce from "debounce";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  FC,
  Key,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type Props = {
  pagosResp: IBPagoResp;
};

const PagosList: FC<Props> = ({ pagosResp }) => {
  const router = useRouter();
  const rows = pagosResp.data;

  const columns = [
    {
      key: "key",
      label: "#",
    },
    {
      key: "monto",
      label: "MONTO",
    },
    {
      key: "metodo_pago",
      label: "METODO",
    },
    {
      key: "img_boucher",
      label: "COMPROBANTE",
    },
    {
      key: "cliente",
      label: "CLIENTE",
    },
    {
      key: "telefono",
      label: "TELÉFONO",
    },
    {
      key: "fecha_pago",
      label: "FECHA",
    },
    {
      key: "taller",
      label: "TALLER",
    },

    { key: "actions", label: "ACTIONS" },
  ];

  const renderCell = useCallback((item: IBPago, columnKey: Key) => {
    const cellValue = item[columnKey as keyof IBPago];

    switch (columnKey) {
      case "cliente":
        return (
          <Chip avatar={<Avatar />} variant="flat" size="sm">
            {item.cliente.nombre} {item.cliente.apellido}
          </Chip>
        );

      case "telefono":
        return <div>{item.cliente.telefono}</div>;

      case "monto":
        return <div>S/{item.monto.toFixed(2)}</div>;

      case "img_boucher":
        return (
          <Button
            color="success"
            className="rounded-none border border-success border-t-0 border-x-0 px-1"
            variant="light"
            size="sm"
            onPress={() => {
              console.log("Ver imagen");
            }}
          >
            Ver Boucher
          </Button>
        );

      case "fecha_pago":
        return (
          <div>
            {format(new Date(item.fecha_pago), "MMM D, YYYY h:mm A", "es")}
          </div>
        );

      case "taller":
        return (
          <Tooltip
            color="foreground"
            content={
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-1">
                  <span>Días: </span>
                  {item.taller.dias.map((dia, index) => (
                    <Chip
                      color="secondary"
                      key={index}
                      variant="bordered"
                      size="sm"
                    >
                      {dia}
                    </Chip>
                  ))}
                </div>
                <div className="flex items-center gap-x-1">
                  <span>Hora: </span>
                  <span className="text-tiny">{item.taller.hora}</span>
                </div>
              </div>
            }
          >
            <Chip color="primary" variant="light">
              <span>{item.taller.nombre}</span>
            </Chip>
          </Tooltip>
        );

      case "actions":
        return (
          <div className="relative flex items-center gap-x-2">
            <Button
              isIconOnly
              color="success"
              variant="light"
              size="sm"
              onPress={() =>
                router.push(
                  `/dashboard/pago/detalle/${item.id_taller_cliente_pago}`
                )
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
                router.push(
                  `/dashboard/pago/editar/${item.id_taller_cliente_pago}`
                )
              }
            >
              <span className="transform rotate-[30deg]">
                <IconEdit />
              </span>
            </Button>
          </div>
        );
      default:
        return typeof cellValue === "object"
          ? JSON.stringify(cellValue)
          : cellValue || "-";
    }
  }, []);

  // ======== TABLA Y PAGINACION =========
  const [data, setData] = useState(rows); // Usamos la lista inicial
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [pagination, setPagination] = useState({
    page: pagosResp.pagination.page,
    limit: pagosResp.pagination.limit,
    total: pagosResp.pagination.total,
    totalPages: pagosResp.pagination.totalPages,
  });

  const limit = pagosResp.pagination.limit;

  const pages = React.useMemo(() => {
    return data?.length ? Math.ceil(data.length / limit) : 0;
  }, [data?.length, limit]);

  const loadingState = isLoading ? "loading" : "idle";

  const fetchPageData = async (text?: string, init?: boolean) => {
    setIsLoading(true);
    try {
      const base = `/api/pago/list?page=${init ? "1" : page}&limit=${limit}`;
      const path = `${base}${text ? `&phoneNumber=${text}` : ""}`;

      const response = await axios.get<IBPagoResp>(path);
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ======== FILTROS =========
  const [errorPhone, setErrorPhone] = useState(false);
  const [filterPhone, setFilterPhone] = useState("");

  const onSearchChange = useCallback(
    debounce((text: string) => {
      console.log("Buscando por telefono:", text);
      if (!REGEX.PHONE.test(text)) setErrorPhone(true);
      if (!text) setErrorPhone(false);

      if (pagination.total > pagination.limit) {
        fetchPageData(text, true);
      }
    }, 1000),
    []
  );

  const onClear = React.useCallback(() => {
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-y-1">
        <div className="flex justify-between gap-3">
          <Input
            size="lg"
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por celular..."
            startContent={<i className="icon-search" />}
            onClear={onClear}
            isInvalid={errorPhone}
            errorMessage={errorPhone ? "Ingrese un número válido" : ""}
            onValueChange={(text) => {
              setFilterPhone(text);
              setErrorPhone(false);
              onSearchChange(text);
            }}
          />
          <Button
            as={Link}
            href="/dashboard/pago/registrar"
            color="primary"
            endContent={<i className="icon-plus" />}
          >
            Registrar Pago
          </Button>
        </div>
        <div className="flex justify-between items-end my-2">
          <span className="text-default-400 text-small">
            Total {data.length} pagos registrados
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
  }, [filterPhone, errorPhone, data.length, onSearchChange]);

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

  useEffect(() => {
    if (page === 1) {
      return setData(pagosResp.data);
    }
    fetchPageData();
  }, [page]);

  return (
    <Table
      topContent={topContent}
      aria-label="Tabla de pagos"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>

      <TableBody
        items={data || []}
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
  );
};

export default PagosList;
