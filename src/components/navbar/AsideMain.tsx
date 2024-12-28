"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const AsideMain = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      id: "leads",
      label: "Gestion de leads",
      href: "/dashboard/leads",
    },

    { id: "llamadas", label: "Llamadas", href: "/dashboard/llamadas" },
    {
      id: "inscripciones",
      label: "Inscripciones",
      href: "/dashboard/inscripciones",
    },
    { id: "pagos", label: "Pagos", href: "/dashboard/pagos" },
    { id: "asistencias", label: "Asistencias", href: "/dashboard/asistencias" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 shadow-lg">
      <div className="p-6 h-full">
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                className="text-2xl font-bold text-center text-white mb-8"
                href="/dashboard"
              >
                Dashboard
              </Link>
            </li>
            {menuItems.map((item) => (
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
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AsideMain;
