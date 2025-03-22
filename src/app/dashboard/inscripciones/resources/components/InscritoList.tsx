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
import { IBInscripcion, IBInscripcionResponse, Pago } from "../definitions";
import { useRouter } from "next/navigation";
import {
  Button,
  Chip,
  ChipProps,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectedItems,
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
} from "@heroui/react";
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
  getLabelInscritoByKey,
} from "@/lib/helpers";
import { format } from "@formkit/tempo";
import { IProfile } from "@/lib/definitions";
import { IBUsuarioOptions } from "@/lib/usuarios/definicions";

type Props = {
  inscripcionesResp: IBInscripcionResponse;
  userProfile: IProfile;
  usuarios: IBUsuarioOptions[];
};
const InscritoList: FC<Props> = (props) => {
  const { inscripcionesResp, userProfile, usuarios } = props;

  const [filterUser, setFilterUser] = useState("");
  const rol = userProfile.rolName;
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
      className: "text-end",
    },
    {
      key: "pagos",
      label: "PAGO TOTAL",
      className: "text-end",
    },
    {
      key: "restante",
      label: "RESTANTE",
      className: "text-end",
    },
    {
      key: "estadoPago",
      label: "ESTADO PAGO",
    },
    {
      key: "taller",
      label: "TALLER",
    },
    {
      key: "promocion",
      label: "PROMOCIÓN",
    },
    // {
    //   key: "observacion",
    //   label: "OBSERVACIONES",
    // },

    { key: "actions", label: "ACTIONS" },
  ];

  const statusColorStatus: Record<string, ChipProps["color"]> = {
    "0": "danger",
    "1": "success",
    "2": "secondary",
    "3": "warning",
    "4": "warning",
  };

  const renderCell = useCallback((item: IBInscripcion, columnKey: Key) => {
    const cellValue = item[columnKey as keyof IBInscripcion];
    const totalPagos = item.pagos.reduce((acc, pago) => acc + pago.monto, 0);

    switch (columnKey) {
      case "nombre":
        const { asesorRegistro, asesorInscripcion } = item;

        return (
          <Tooltip
            showArrow
            color={
              asesorRegistro.id === asesorInscripcion.id
                ? "foreground"
                : "danger"
            }
            content={
              <div className="text-tiny flex flex-col gap-y-1">
                <span>
                  <b>
                    {asesorRegistro.id !== asesorInscripcion.id
                      ? "Cliente de: "
                      : "Assesor: "}
                  </b>
                  {asesorRegistro.nombre}
                </span>
                {asesorRegistro.id !== asesorInscripcion.id && (
                  <span>Inscrito por: {asesorInscripcion.nombre}</span>
                )}
              </div>
            }
          >
            <Chip
              color={
                asesorRegistro.id === asesorInscripcion.id
                  ? "default"
                  : "danger"
              }
              avatar={
                <IconEye
                  size={22}
                  color={
                    asesorRegistro.id === asesorInscripcion.id
                      ? "#17c964"
                      : "#f54180"
                  }
                />
              }
              variant="light"
              size="sm"
            >
              {formatearNombre(item.nombre, 17)}
            </Chip>
          </Tooltip>
        );

      case "telefono":
        return (
          <Chip className="flex items-center" variant="light" size="sm">
            {formatPhoneNumber(item.telefono)}
          </Chip>
        );

      case "estado":
        return (
          <Chip
            className="flex items-center"
            variant="flat"
            size="sm"
            color={statusColorStatus[item.estado]}
          >
            {getLabelInscritoByKey(item.estado)}
          </Chip>
        );

      case "precioVenta":
        return (
          <div className="w-full flex justify-end items-center  gap-x-2 mr-3">
            S/{item.precioVenta.toFixed(2)}
          </div>
        );

      case "pagos":
        return (
          <div className="w-full flex justify-end items-center">
            <Button
              color="success"
              className="flex items-center justify-around px-0 hover:text-white hover:!bg-transparent"
              variant="light"
              startContent={<IconEye  color={"white"} />}
              onPress={() => {
                setBouchers(item.pagos);
                onOpen();
              }}
            >
              S/{totalPagos.toFixed(2)}
            </Button>
          </div>
        );

      case "restante":
        const restante = item.precioVenta - totalPagos;

        return (
          <div className="w-full flex justify-end items-center gap-x-2 mr-3">
            {restante ? "S/" + restante.toFixed(2) : "-"}
          </div>
        );

      case "estadoPago":
        return (
          <Chip
            size="sm"
            variant="light"
            color={getColorByStatus(item.estadoPago)}
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
          <div className="relative flex items-center">
            <Button
              isIconOnly
              color="success"
              variant="light"
              size="sm"
              onPress={() =>
                router.push(`/dashboard/inscripciones/detalle/${item.id}`)
              }
            >
              <IconEye />
            </Button>

            {rol === "admin" && (
              <Button
                isIconOnly
                color="default"
                variant="light"
                size="sm"
                onPress={() =>
                  router.push(`/dashboard/inscripciones/editar/${item.id}`)
                }
              >
                <span className="transform rotate-[30deg]">
                  <IconEdit />
                </span>
              </Button>
            )}
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
  const [isFirtsRender, setIsFirstRender] = useState(true);

  const [pagination, setPagination] = useState(inscripcionesResp.pagination);
  const limit = pagination.limit;

  const pages = React.useMemo(() => {
    return data?.length ? Math.ceil(data.length / limit) : 0;
  }, [data?.length, limit]);

  // ======== FILTROS =========
  const [errorPhone, setErrorPhone] = useState(false);
  const [filterPhone, setFilterPhone] = useState("");

  const fetchPageData = async (filter?: {
    text?: string;
    init?: boolean;
    user: string;
  }) => {
    const { text, init } = filter || {};
    setIsLoading(true);
    try {
      const initPage = init ? 1 : page;
      const filterByPhone = text ? `&phoneNumber=${text}` : "";
      const filterByUser = filter?.user || "all";
      const base = `/api/inscrito/list?page=${initPage}&limit=${limit}`;

      const path = `${base}&id_usuario=${filterByUser}${filterByPhone}`;

      const response = await axios.get<IBInscripcionResponse>(path);
      setData(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSearchChange = useCallback(
    debounce((filter: { text: string; user: string }) => {
      const { text } = filter;
      if (!REGEX.PHONE.test(text)) setErrorPhone(true);
      if (!text) setErrorPhone(false);

      if (pagination.total > pagination.limit) {
        fetchPageData({ ...filter, init: true });
      }
    }, 1200),
    []
  );

  const loadingState = isLoading ? "loading" : "idle";

  const onClear = React.useCallback(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    if (!isFirtsRender)
      fetchPageData({
        text: filterPhone,
        user: filterUser,
      });
    else setIsFirstRender(false);
  }, [page]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-y-1">
        <div className="flex justify-between gap-3">
          <div className="flex flex-[0.60] gap-x-2">
            <Input
              size="lg"
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Buscar por celular..."
              startContent={<i className="icon-search" />}
              onClear={onClear}
              isInvalid={errorPhone}
              errorMessage={errorPhone ? "Ingrese un número válido" : ""}
              onValueChange={(phone) => {
                setFilterPhone(phone);
                setErrorPhone(false);
                onSearchChange({
                  text: phone,
                  user: filterUser,
                });
              }}
            />
            <Select
              size="lg"
              items={usuarios}
              placeholder="Filtro por usuario"
              defaultSelectedKeys={["all"]}
              renderValue={(users: SelectedItems<IBUsuarioOptions>) => {
                return users.map((user) => (
                  <div key={user.key} className="flex users-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-md">{user.data?.label}</span>
                      <span className="text-tiny text-cyan-500">
                        {user.data?.telefono}
                      </span>
                    </div>
                  </div>
                ));
              }}
              onChange={(user) => {
                setFilterUser(user.target.value);
                onSearchChange({
                  text: filterPhone,
                  user: user.target.value,
                });
              }}
            >
              {(user) => (
                <SelectItem key={user.key} textValue={user.label}>
                  <div className="flex gap-2 items-center">
                    <div
                      className="w-[1rem] h-[1rem] rounded-full"
                      style={{ background: user.code }}
                    />
                    <div className="flex flex-col">
                      <span className="text-small">
                        {formatearNombre(user.label, 20)}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>
          </div>

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
            Total {pagination.total} inscritos registrados
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
        isStriped
        topContent={topContent}
        aria-label="Tabla de pagos"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn className={column.className} key={column.key}>
              {column.label}
            </TableColumn>
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
          {() => (
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
                        isZoomed
                        className="h-full rounded-md"
                        src={boucher.imgBoucher}
                        alt={"boucher" + i}
                        height={310}
                      />
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default InscritoList;
