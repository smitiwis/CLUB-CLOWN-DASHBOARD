"use client";

import Link from "next/link";
import React, { FC } from "react";
import { usePathname } from "next/navigation";
// import Image from "next/image";
import { Divider } from "@nextui-org/react";
import Image from "next/image";
import { IUserProfile } from "@/lib/definitions";

const AsideMain: FC<IUserProfile> = ({ user }) => {
  const pathname = usePathname();

  const menuItems = [
    {
      id: "user",
      label: "Asesores",
      href: "/dashboard/usuarios",
      show: ["admin"],
    },
    {
      id: "leads",
      label: "Gestion de leads",
      href: "/dashboard/leads",
      show: ["admin", "comercial", "marketing"],
    },

    {
      id: "llamadas",
      label: "Llamadas",
      href: "/dashboard/llamadas",
      show: ["admin", "comercial"],
    },
    {
      id: "talleres",
      label: "Talleres",
      href: "/dashboard/talleres",
      show: ["admin"],
    },
    {
      id: "inscripciones",
      label: "Inscripciones",
      href: "/dashboard/inscripciones",
      show: ["admin", "comercial", "marketing"],
    },
    {
      id: "pagos",
      label: "Pagos",
      href: "/dashboard/pagos",
      show: ["admin", "comercial", "marketing"],
    },
    {
      id: "asistencia",
      label: "Asistencia",
      href: "/dashboard/asistencia",
      show: ["admin", "comercial", "marketing"],
    },
  ];

  return (
    <aside className="w-64 px-6 pt-8 pb-6 bg-gray-900 border-r-1 border-gray-700">
      <div className="h-full">
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                className="flex flex-col gap-y-3 items-center text-2xl font-bold text-center text-white mb-8"
                href="/dashboard"
              >
                <Image
                  className="rounded-full shadow-md shadow-slate-700"
                  src="/images/logo.jpg"
                  alt="Logo"
                  width={100}
                  height={100}
                />
                Dashboard
              </Link>
              <Divider className="mb-6" />
            </li>
            {menuItems.map((item) => {
              if (item.show.includes(user.rolName)) {
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`block py-2 px-4 rounded-md transition ${
                        pathname === item.href
                          ? "bg-gray-700 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AsideMain;
