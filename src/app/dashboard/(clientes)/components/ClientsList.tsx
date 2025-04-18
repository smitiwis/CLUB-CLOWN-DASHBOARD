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
  addToast,
  Chip,
  ChipProps,
  Badge,
  Pagination,
  Spinner,
  Input,
  Select,
  SelectedItems,
  SelectItem,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  ModalBody,
  Alert,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DateRangePicker,
} from "@heroui/react";
import {
  IBClients,
  IBClientsResp,
  IRowClientTable,
} from "@/lib/clients/definitions";
import {
  CATEGORIA_CLIENT,
  COLORES,
  GROUPS_CLIENT,
  IColors,
  ORIGENES_CLIENTS,
} from "@/constants";
import { useRouter } from "next/navigation";
import IconEdit from "@/components/icons/IconEdit";
import IconEye from "@/components/icons/IconEye";
import IconPhone from "@/components/icons/IconPhone";
import { format, isAfter } from "@formkit/tempo";
import axios from "axios";
import Link from "next/link";
import debounce from "debounce";
import { REGEX } from "@/constants/regex";
import {
  formatearNombre,
  formatPhoneNumber,
  getLabelCategoryByKey,
} from "@/lib/helpers";
import IconTrash from "@/components/icons/IconTrash";
import { IBUsuarioOptions } from "@/lib/usuarios/definicions";

type Props = {
  clientsResp: IBClientsResp;
  usuarios: IBUsuarioOptions[];
  myUserId: string;
  userRol: string;
};

const ClientsList: FC<Props> = ({
  clientsResp,
  usuarios,
  myUserId,
  userRol,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [clientSelected, setClientSelected] = useState<IRowClientTable>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);

  // ========= FILTROS =========
  const [errorPhone, setErrorPhone] = useState(false);
  const [filterPhone, setFilterPhone] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterUser, setFilterUser] = useState(myUserId);
  const [filterDate, setfilterDate] = useState<null | {
    start: string;
    end: string;
  }>(null);

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
        fecha_creacion: format(lead.fecha_creacion, {
          date: "medium",
        }),
        usuario: lead.usuario.nombre,
        userId: lead.usuario.id_usuario,
      };
    });
  };
  const rows: IRowClientTable[] = adapteRows(clientsResp.data);

  const generateColumns = [
    {
      key: "estado",
      label: "ESTADO",
      className: "",
    },
    {
      key: "usuario",
      label: "ASESOR",
      className: "",
    },
    {
      key: "origen",
      label: "ORIGEN",
      className: "text-center",
    },
    {
      key: "telefono",
      label: "CELULAR",
      className: "",
    },
    {
      key: "nombre",
      label: "NOMBRE",
      className: "",
    },
    {
      key: "fecha_creacion",
      label: "FECHA",
      className: "",
    },
    {
      key: "Categoria",
      label: "CATEGORIA",
      className: "",
    },
    {
      key: "edad",
      label: "EDAD",
      className: "",
    },
    {
      key: "grupo",
      label: "GRUPO",
      className: "",
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

  const categoryColor: Record<string, ChipProps["color"]> = {
    "1": "warning",
    "2": "danger",
    "3": "success",
    "4": "primary",
    "5": "secondary",
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
                className={`w-[1.75rem] h-[1.75rem] rounded-full flex justify-center items-center ${
                  item.isCallToday ? "border-2 border-red-500" : ""
                }`}
                style={{ background: color?.code || "white" }}
              >
                {item.isCallToday && (
                  <i className="icon-check text-danger text-sm "></i>
                )}
              </div>
            </Tooltip>
          </Badge>
        );

      case "telefono":
        const copyToClipboard = async () => {
          try {
            setShowCopy(true);
            await navigator.clipboard.writeText(item.telefono);
          } catch (err) {
            console.error("Error al copiar: ", err);
          } finally {
            setTimeout(() => {
              setShowCopy(false);
            }, 1000);
          }
        };

        const ButtonToast = () => (
          <Button
            className="flex gap-x-2 relative cursor-pointer"
            variant="light"
            startContent={
              <i className="text-cyan-400 icon-clipboard pt-1 text-medium cursor-pointer" />
            }
            onPress={() => {
              copyToClipboard();
              addToast({
                timeout: 1000,
                variant: "bordered",
                color: "success",
                title: "Numero copiado",
              });
            }}
          >
            {formatPhoneNumber(item.telefono)}
          </Button>
        );

        return (
          <div className="text-small">
            {item?.estadoAgenda ? (
              <Tooltip
                size="sm"
                color={statusColorAgenda[item.estadoAgenda]}
                isDisabled={item.estadoAgenda === "2"}
                content={
                  <div className="flex flex-col gap-x-1">
                    <b>Fecha agendada: </b>
                    {item.fechaAgendada}
                  </div>
                }
                placement="right"
                showArrow
              >
                <Badge
                  color={statusColorAgenda[item.estadoAgenda]}
                  content=""
                  placement="top-right"
                >
                  <ButtonToast />
                </Badge>
              </Tooltip>
            ) : (
              <ButtonToast />
            )}
          </div>
        );

      case "origen":
        return (
          <>
            <div className="flex justify-center items-center">
              <i
                className={`text-2xl text-green-500 ${
                  ORIGENES_CLIENTS.find(({ key }) => key === item.origen)?.icon
                }`}
              />
            </div>
          </>
        );

      case "nombre":
        const nameComplete = `${item.nombre} ${item.apellido}`;
        if (item.nombre_apo) {
          return (
            <Tooltip
              size="sm"
              content={
                <div className="flex flex-col gap-x-1">
                  <b>Apoderado: </b>
                  {item.nombre_apo}
                </div>
              }
              placement="right"
              color="warning"
              showArrow
            >
              <Badge content="" color="warning" variant="shadow">
                <Chip avatar={<Avatar />} variant="flat" size="sm">
                  {formatearNombre(nameComplete, 25)}
                </Chip>
              </Badge>
            </Tooltip>
          );
        }
        return (
          <Chip avatar={<Avatar />} variant="flat" size="sm">
            {formatearNombre(nameComplete, 25)}
          </Chip>
        );

      case "Categoria":
        return (
          <Chip size="sm" color={categoryColor[item.categoria]} variant="flat">
            {getLabelCategoryByKey(item.categoria)}
          </Chip>
        );

      case "usuario":
        return (
          <div className="flex flex-col">
            <span className="text-small">{item.usuario}</span>
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
          <div className="relative flex items-center">
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

            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <i className="icon-ellipsis-v text-gray-300 text-xl" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="Detalles"
                  onPress={() =>
                    router.push(`/dashboard/lead/detalle/${item.id_cliente}`)
                  }
                >
                  <div className="flex gap-x-2 items-center">
                    <IconEye />
                    <span>Detalles</span>
                  </div>
                </DropdownItem>
                {myUserId === item.userId ? (
                  <DropdownItem
                    key="Editar"
                    onPress={() =>
                      router.push(`/dashboard/lead/editar/${item.id_cliente}`)
                    }
                  >
                    <div className="flex gap-x-2 items-center">
                      <span className="transform rotate-[35deg]">
                        <IconEdit />
                      </span>
                      <span>Editar</span>
                    </div>
                  </DropdownItem>
                ) : null}
                {myUserId === item.userId ? (
                  <DropdownItem
                    key="Eliminar"
                    onPress={() => {
                      setClientSelected(item);
                      onOpen();
                    }}
                  >
                    <div className="flex gap-x-2 items-center">
                      <IconTrash />
                      <span>Eliminar</span>
                    </div>
                  </DropdownItem>
                ) : null}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue || "-";
    }
  }, []);

  // ======== TABLA Y PAGINACION =========
  const [columns, setColumns] = useState(generateColumns);
  const [data, setData] = useState(rows); // Usamos la lista inicial
  const [page, setPage] = useState(clientsResp.page);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirtsRender, setIsFirstRender] = useState(true);

  const limit = clientsResp.limit;

  const pages = React.useMemo(() => {
    return data?.length ? Math.ceil(data.length / limit) : 0;
  }, [data?.length, limit]);

  const loadingState = isLoading ? "loading" : "idle";

  const fetchPageData = async (filter?: {
    text?: string;
    status?: string;
    init?: boolean;
    category?: string;
    user: string;
    date: {
      start: string;
      end: string;
    } | null;
  }) => {
    setIsLoading(true);
    const text = (filter?.text || "").replace(/\s+/g, "").trim();
    const status = filter?.status || "";
    const category = filter?.category || "";
    const id_usuario = filter?.user || "";
    const init = filter?.init || false;
    const date = filter?.date || "";

    try {
      const baseStatic = `/api/usuario/${id_usuario}/cliente/lista`;
      const base = `${baseStatic}?page=${init ? "1" : page}&limit=${limit}`;
      const textFilter = text ? `&phoneNumber=${text}` : "";
      const statusFilter = status ? `&status=${status}` : "";
      const categoryFilter = category ? `&categoria=${category}` : "";
      const dateFilter = date ? `&date=${JSON.stringify(date)}` : "";

      const queryParam = `${textFilter}${statusFilter}${categoryFilter}${dateFilter}`;
      const path = `${base}${queryParam}`;

      const response = await axios.get(path);
      setData(adapteRows(response.data.data));
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error al filtrar leads", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filter = {
      text: filterPhone,
      status: filterStatus,
      category: filterCategory,
      user: filterUser,
      date: filterDate,
    };

    if (!isFirtsRender) fetchPageData(filter);
    else setIsFirstRender(false);
  }, [page]);

  const [pagination, setPagination] = useState({
    page: clientsResp.page,
    limit: clientsResp.limit,
    total: clientsResp.total,
    totalPages: clientsResp.totalPages,
  });

  const onSearchChange = useCallback(
    debounce(
      (filter: {
        text: string;
        status: string;
        user: string;
        category: string;
        date: {
          start: string;
          end: string;
        } | null;
      }) => {
        const textSinEspacios = filter.text.replace(/\s+/g, "");
        if (!REGEX.PHONE.test(textSinEspacios)) setErrorPhone(true);
        if (!textSinEspacios) setErrorPhone(false);

        fetchPageData({ ...filter, init: true });
      },
      1200
    ),
    []
  );

  const onClear = React.useCallback(() => {
    setPage(1);
  }, []);

  const handleDownload = async () => {
    setLoadingFile(true);
    try {
      const filter = {
        text: filterPhone,
        status: filterStatus,
        user: filterUser,
        category: filterCategory,
        date: filterDate,
      };

      const text = (filter?.text || "").replace(/\s+/g, "").trim();
      const status = filter?.status || "";
      const category = filter?.category || "";
      const id_usuario = filter?.user || "";
      const date = filter?.date || "";

      const baseStatic = `/api/export-data/${id_usuario}`;
      const base = `${baseStatic}?page=${page}&limit=${limit}`;
      const textFilter = text ? `&phoneNumber=${text}` : "";
      const statusFilter = status ? `&status=${status}` : "";
      const categoryFilter = category ? `&categoria=${category}` : "";
      const dateFilter = date ? `&date=${JSON.stringify(date)}` : "";

      const queryParam = `${textFilter}${statusFilter}${categoryFilter}${dateFilter}`;
      const path = `${base}${queryParam}`;

      const response = await axios.get(path, { responseType: "blob" }); // Importante para manejar la respuesta como un Blob

      // Crear un objeto URL a partir del Blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `leads_${new Date().toISOString()}.xlsx`); // Nombre del archivo a descargar
      document.body.appendChild(link);
      link.click();

      if (link.parentNode) {
        // Limpiar y revocar el objeto URL
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
    } finally {
      setLoadingFile(false);
    }
  };

  useEffect(() => {
    if (myUserId === filterUser) {
      const newColumns = columns.filter((column) => column.key !== "usuario");
      setColumns(newColumns);
    } else {
      setColumns(generateColumns);
    }
  }, [filterUser]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-y-1">
        <div className="flex flex-1 justify-between gap-3">
          <div className="flex flex-[0.75] gap-2">
            <Input
              size="lg"
              fullWidth
              isClearable
              placeholder="Buscar por celular..."
              startContent={<i className="icon-search" />}
              onClear={onClear}
              isInvalid={errorPhone}
              errorMessage={errorPhone ? "Ingrese un número válido" : ""}
              value={filterPhone}
              onValueChange={(value) => {
                setFilterPhone(value.replace(/\s+/g, ""));
                setErrorPhone(false);
                onSearchChange({
                  text: value,
                  status: filterStatus,
                  user: filterUser,
                  category: filterCategory,
                  date: filterDate,
                });
              }}
            />

            <DateRangePicker
              size="lg"
              className="max-w-xs"
              onChange={(e) => {
                if (e) {
                  const {start, end} = e;

                  const monthStart = start.month < 10 ? `0${start.month}` : start.month;
                  const dayStart = start.day < 10 ? `0${start.day}` : start.day;
                  const monthEnd = end.month < 10 ? `0${end.month}` : end.month;
                  const dayEnd = end.day < 10 ? `0${end.day}` : end.day;

                  const startDate = `${start.year}-${monthStart}-${dayStart}`;
                  const endDate = `${end.year}-${monthEnd}-${dayEnd}`;
                  setfilterDate({ start: startDate, end: endDate });
                  onSearchChange({
                    text: filterPhone,
                    status: filterStatus,
                    category: filterCategory,
                    user: filterUser,
                    date: { start: startDate, end: endDate },
                  });
                }
              }}
            />
          </div>
          <div className="flex justify-end flex-[0.25]">
            <Button
              as={Link}
              href="/dashboard/lead/crear"
              color="primary"
              size="lg"
              endContent={<i className="icon-plus" />}
            >
              Agregar lead
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-end mt-2 gap-3">
          <div className="flex flex-[0.75] gap-x-2">
            <Select
              size="lg"
              items={usuarios}
              defaultSelectedKeys={[myUserId]}
              placeholder="Filtro por usuario"
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
                  status: filterStatus,
                  category: filterCategory,
                  user: user.target.value,
                  date: filterDate,
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

            <Select
              size="lg"
              items={COLORES}
              placeholder="Estado"
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
              onChange={(item) => {
                setFilterStatus(item.target.value);
                onSearchChange({
                  text: filterPhone,
                  status: item.target.value,
                  user: filterUser,
                  category: filterCategory,
                  date: filterDate,
                });
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

            <Select
              size="lg"
              items={CATEGORIA_CLIENT}
              placeholder="Categoría"
              renderValue={(items) => {
                return items.map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span>{item.data?.label}</span>
                    </div>
                  </div>
                ));
              }}
              onChange={(item) => {
                setFilterCategory(item.target.value);
                onSearchChange({
                  text: filterPhone,
                  status: filterStatus,
                  user: filterUser,
                  category: item.target.value,
                  date: filterDate,
                });
              }}
            >
              {(color) => (
                <SelectItem key={color.key} textValue={color.label}>
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col">
                      <span className="text-small">{color.label}</span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>
          </div>

          <label className="flex flex-[0.25] gap-x-2 justify-end items-center text-default-400 text-small">
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
  }, [
    filterPhone,
    filterStatus,
    filterUser,
    filterCategory,
    filterDate,
    onSearchChange,
    data.length,
    errorPhone,
    showCopy,
    loadingFile,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex w-full justify-between items-center relative min-h-[2.5rem]">
        <span className="text-default-400 text-small">
          Total: {pagination.total} clientes
        </span>
        <Pagination
          className="absolute left-[50%] transform translate-x-[-50%] bottom-0"
          isCompact
          showControls
          showShadow
          color="primary"
          page={pagination.page}
          total={pagination.totalPages}
          onChange={(newPage) => setPage(newPage)}
        />
        {userRol === "admin" && pagination.total > 0 && (
          <Button
            isLoading={loadingFile}
            color="primary"
            variant="ghost"
            startContent={<i className="icon-download" />}
            onPress={handleDownload}
          >
            Descargar
          </Button>
        )}
      </div>
    );
  }, [pages, pagination]);

  return (
    <div>
      <Table
        isHeaderSticky
        aria-label="Tabla de clientes"
        topContent={topContent}
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => {
            const handleDeleteClient = async () => {
              try {
                setLoadingDelete(true);
                if (
                  clientSelected &&
                  clientSelected.nro_llamadas === 0 &&
                  clientSelected.estado === "4"
                ) {
                  const path = `/api/cliente/${clientSelected.id_cliente}/delete`;
                  const fetchDelete = await axios.delete(path);

                  if (fetchDelete.status !== 200) return;
                  setLoadingDelete(false);
                  onClose();

                  // ACTUALIZAR DATA
                  fetchPageData({
                    text: filterPhone,
                    status: filterStatus,
                    user: filterUser,
                    date: filterDate,
                    init: true,
                  });
                } else onClose();
              } catch (error) {
                console.error("Error al eliminar el cliente", error);
              } finally {
                setLoadingDelete(false);
                onClose();
              }
            };

            return (
              <>
                <ModalHeader className="flex justify-center gap-1">
                  {clientSelected &&
                  (clientSelected.nro_llamadas === 0 ||
                    clientSelected.estado === "4")
                    ? "¿Seguro que deseas elimnarlo?"
                    : "NO SE PEUDE ELIMINAR"}
                </ModalHeader>
                {clientSelected &&
                  (clientSelected.nro_llamadas >= 1 ||
                    clientSelected.estado !== "4") && (
                    <ModalBody>
                      <Alert
                        hideIcon
                        variant="flat"
                        color="warning"
                        title=""
                        description="No se peude eliminar un cliente inscrito o con llamadas registradas."
                      />
                    </ModalBody>
                  )}
                <ModalFooter className="flex justify-center gap-2">
                  <Button color="primary" variant="bordered" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    isLoading={loadingDelete}
                    color="primary"
                    onPress={handleDeleteClient}
                  >
                    {clientSelected &&
                    (clientSelected.nro_llamadas >= 1 ||
                      clientSelected.estado !== "4")
                      ? "ACEPTAR"
                      : "CONFIRMAR"}
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ClientsList;
