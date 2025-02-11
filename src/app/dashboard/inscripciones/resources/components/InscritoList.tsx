/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { FC, Key, useCallback, useMemo, useState } from "react";
import { IBInscripcion, IBInscripcionResponse, Pago } from "../definitions";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
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
  useDisclosure,
} from "@nextui-org/react";
import IconEye from "@/components/icons/IconEye";
import IconEdit from "@/components/icons/IconEdit";
import Link from "next/link";
import { REGEX } from "@/constants/regex";
import debounce from "debounce";
import axios from "axios";
import {
  formatearNombre,
  formatPhoneNumber,
  getColorByStatus,
  getLabelByStatus,
} from "@/lib/helpers";
import Image from "next/image";
import { format } from "@formkit/tempo";

type Props = {
  inscripcionesResp: IBInscripcionResponse;
};
const InscritoList: FC<Props> = ({ inscripcionesResp }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [bouchers, setBouchers] = useState<Pago[]>([]);
  const router = useRouter();
  const rows = inscripcionesResp.data;

  const columns = [
    {
      key: "key",
      label: "#",
    },
    {
      key: "nombre",
      label: "NOMBRE Y APELLIDO",
    },
    {
      key: "telefono",
      label: "TELÉFONO",
    },
    {
      key: "estado",
      label: "ESTADO",
    },
    {
      key: "precioVenta",
      label: "PRECIO VENTA",
    },
    {
      key: "pagos",
      label: "PAGO TOTAL",
    },
    {
      key: "restante",
      label: "RESTANTE",
    },
    {
      key: "estadoPago",
      label: "PAGOS",
    },
    {
      key: "taller",
      label: "TALLER",
    },
    {
      key: "promocion",
      label: "PROMOCIÓN",
    },
    {
      key: "observacion",
      label: "OBSERVACIONES",
    },

    { key: "actions", label: "ACTIONS" },
  ];

  const renderCell = useCallback((item: IBInscripcion, columnKey: Key) => {
    const cellValue = item[columnKey as keyof IBInscripcion];
    const totalPagos = item.pagos.reduce((acc, pago) => acc + pago.monto, 0);

    const ChipName = () => (
      <Chip avatar={<Avatar />} variant="flat" size="sm">
        {formatearNombre(item.nombre, 20)}
      </Chip>
    );

    switch (columnKey) {
      case "nombre":
        const { asesorRegistro, asesorInscripcion } = item;

        if (asesorRegistro.id === asesorInscripcion.id) return <ChipName />;

        return (
          <Tooltip
            color="danger"
            content={
              <div className="text-tiny flex flex-col gap-y-1">
                <span>Cliente de: {asesorRegistro.nombre}</span>
                <span>Inscrito por: {asesorInscripcion.nombre}</span>
              </div>
            }
            showArrow
          >
            <Badge
              color="danger"
              size="sm"
              placement="top-left"
              content={<IconEye size={18} color="white" />}
            >
              <ChipName />
            </Badge>
          </Tooltip>
        );

      case "telefono":
        return (
          <div className="flex items-center gap-x-2">
            {formatPhoneNumber(item.telefono)}
          </div>
        );

      case "estado":
        const isActive = parseInt(item.estado);
        return (
          <Chip
            className="flex items-center"
            variant="flat"
            size="sm"
            color={isActive ? "success" : "danger"}
          >
            {isActive ? "Activo" : "Inactivo"}
          </Chip>
        );

      case "precioVenta":
        return (
          <div className="flex justify-end items-center gap-x-2 mr-3">
            S/{item.precioVenta.toFixed(2)}
          </div>
        );

      case "pagos":
        return (
          <div className="flex justify-end items-center gap-x-2 mr-3">
            S/{totalPagos.toFixed(2)}
          </div>
        );

      case "restante":
        const restante = item.precioVenta - totalPagos;

        return (
          <div className="flex justify-end items-center gap-x-2 mr-3">
            S/{restante.toFixed(2)}
          </div>
        );

      case "estadoPago":
        console.log("item", item);
        console.log("item estadoPago", item.estadoPago);
        return (
          <Chip
            variant="faded"
            size="sm"
            color={getColorByStatus(item.estadoPago)}
            onClick={() => {
              setBouchers(item.pagos);
              onOpen();
            }}
            className="cursor-pointer"
            startContent={<IconEye size={18} color={"white"} />}
          >
            {getLabelByStatus(item.estadoPago)}
          </Chip>
        );

      case "promocion":
        // return item.promocion?.nombre || "-";
        return (
          <Tooltip
            content={`Dscto: S/${item.promocion?.descuento.toFixed(2)}`}
            showArrow
            color="warning"
            placement="right-end"
            size="sm"
          >
            <Chip variant="light">{item.promocion?.nombre}</Chip>
          </Tooltip>
        );
      case "taller":
        return (
          <Tooltip
            content={`Precio: S/${item.taller.precio.toFixed(2)}`}
            showArrow
            color="success"
            placement="right-end"
            size="sm"
          >
            <Chip variant="light">{item.taller?.nombre}</Chip>
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
              onPress={() => router.push(`/dashboard/pago/detalle/${item.id}`)}
            >
              <IconEye />
            </Button>

            <Button
              isIconOnly
              color="success"
              variant="light"
              size="sm"
              onPress={() => router.push(`/dashboard/pago/editar/${item.id}`)}
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

  const fetchPageData = async (text?: string, init?: boolean) => {
    setIsLoading(true);
    try {
      const base = `/api/inscrito/list?page=${
        init ? "1" : page
      }&limit=${limit}`;
      const path = `${base}${text ? `&phoneNumber=${text}` : ""}`;

      const response = await axios.get<IBInscripcionResponse>(path);
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ======== TABLA Y PAGINACION =========
  const [data, setData] = useState(rows); // Usamos la lista inicial
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [pagination, setPagination] = useState(inscripcionesResp.pagination);
  const limit = pagination.limit;

  const pages = React.useMemo(() => {
    return data?.length ? Math.ceil(data.length / limit) : 0;
  }, [data?.length, limit]);

  // ======== FILTROS =========
  const [errorPhone, setErrorPhone] = useState(false);
  const [filterPhone, setFilterPhone] = useState("");

  const onSearchChange = useCallback(
    debounce((text: string) => {
      if (!REGEX.PHONE.test(text)) setErrorPhone(true);
      if (!text) setErrorPhone(false);

      if (pagination.total > pagination.limit) {
        fetchPageData(text, true);
      }
    }, 1000),
    []
  );

  const loadingState = isLoading ? "loading" : "idle";

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
            href="/dashboard/inscripciones/registrar"
            color="primary"
            endContent={<i className="icon-plus" />}
            size="lg"
          >
            INSCRIBIR ALUMNO
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

  const bottomContent = useMemo(() => {
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
    <>
      <Table
        topContent={topContent}
        aria-label="Tabla de pagos"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-center flex flex-col gap-1">
                COMPROBANTES DE PAGO
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-center gap-x-2">
                  {bouchers.map((boucher, i) => (
                    <div key={i} className="flex flex-col items-center gap-y-2">
                      <span className="text-small">
                        {format(boucher.fecha, "D MMM YYYY, h:mm A", "es")}
                      </span>
                      <Image
                        className="h-full rounded-md"
                        src={boucher.imgBoucher}
                        alt={"boucher" + i}
                        width={150}
                        height={200}
                      />
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-center gap-x-2 w-full">
                  <Button color="primary" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Aceptar
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default InscritoList;
