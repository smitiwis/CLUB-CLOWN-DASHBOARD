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
} from "@nextui-org/react";
import {
  IBClients,
  IBClientsResp,
  IRowClientTable,
} from "@/lib/clients/definitions";
import { COLORES, GROUPS_CLIENT, IColors, ORIGENES_CLIENTS } from "@/constants";
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
};

const ClientsList: FC<Props> = ({ clientsResp, usuarios, myUserId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [clientSelected, setClientSelected] = useState<IRowClientTable>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [showCopy, setShowCopy] = useState(false);

  // ========= FILTROS =========
  const [errorPhone, setErrorPhone] = useState(false);
  const [filterPhone, setFilterPhone] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterUser, setFilterUser] = useState(myUserId);

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
        return (
          <div
            className="flex flex-col gap-x-1 relative cursor-pointer"
            onClick={copyToClipboard}
          >
            <div className="flex items-center gap-x-1">
              <i className="text-cyan-400 icon-clipboard pt-1 text-medium cursor-pointer" />
              <span className="text-small">
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
                      <span className="pt-1 pr-3">
                        {formatPhoneNumber(item.telefono)}
                      </span>
                    </Badge>
                  </Tooltip>
                ) : (
                  <span className="pt-1 pr-3">
                    {formatPhoneNumber(item.telefono)}
                  </span>
                )}
              </span>
            </div>
          </div>
        );

      case "origen":
        return (
          <div className="flex justify-center items-center">
            <i
              className={`text-2xl text-green-500 ${
                ORIGENES_CLIENTS.find(({ key }) => key === item.origen)?.icon
              }`}
            />
          </div>
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
        console.log("MY ID: ", myUserId);
        console.log("ID: ", item.userId);
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
                  <i className="icon-ellipsis-v text-default-300 text-xl" />
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

  const limit = clientsResp.limit;

  const pages = React.useMemo(() => {
    return data?.length ? Math.ceil(data.length / limit) : 0;
  }, [data?.length, limit]);

  const loadingState = isLoading ? "loading" : "idle";

  const fetchPageData = async (filter?: {
    text?: string;
    status?: string;
    init?: boolean;
    user: string;
  }) => {
    setIsLoading(true);
    const text = (filter?.text || "").replace(/\s+/g, "").trim();
    const status = filter?.status || "";
    const id_usuario = filter?.user || "";
    const init = filter?.init || false;

    try {
      const base = `/api/usuario/${id_usuario}/cliente/lista?page=${
        init ? "1" : page
      }&limit=${limit}`;
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
    const filter = {
      text: filterPhone,
      status: filterStatus,
      user: filterUser,
    };
    fetchPageData(filter);
  }, [page]);

  const [pagination, setPagination] = useState({
    page: clientsResp.page,
    limit: clientsResp.limit,
    total: clientsResp.total,
    totalPages: clientsResp.totalPages,
  });

  const onSearchChange = useCallback(
    debounce((filter: { text: string; status: string; user: string }) => {
      const textSinEspacios = filter.text.replace(/\s+/g, "");
      if (!REGEX.PHONE.test(textSinEspacios)) setErrorPhone(true);
      if (!textSinEspacios) setErrorPhone(false);

      fetchPageData({ ...filter, init: true });
    }, 1000),
    []
  );

  const onClear = React.useCallback(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    debugger;
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
            value={filterPhone}
            onValueChange={(value) => {
              setFilterPhone(value.replace(/\s+/g, ""));
              setErrorPhone(false);
              onSearchChange({
                text: value,
                status: filterStatus,
                user: filterUser,
              });
            }}
          />
          <div className="flex gap-3 flex-1">
            <div className="flex flex-1 gap-x-2">
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
            </div>
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
        <div className="flex justify-between items-end my-2">
          <span className="text-default-400 text-small">
            Total {pagination.total} clientes
          </span>
          {showCopy && (
            <span className="text-tiny text-success flex gap-x-1 items-center">
              <i className="icon-check" />
              <span>Copiado!</span>
            </span>
          )}
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
  }, [
    filterPhone,
    filterStatus,
    filterUser,
    onSearchChange,
    data.length,
    errorPhone,
    showCopy,
  ]);

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
        aria-label="Tabla de clientes"
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
