import React from "react";

import { redirect } from "next/navigation";
import HeaderProfile from "./HeaderProfile";
import { fetchProfileById } from "@/lib/usuarios/services";

const HeaderMain = async () => {
  const profile = await fetchProfileById();
  if (!profile) redirect("/login");

  const userProfile = {
    name: profile.nombre,
    rolName: profile.rol.nombre,
    callsPending: profile.callsPending,
  };

  return (
    <div className="bg-gray-900 h-full py-3 px-8 flex justify-end items-center border-b-1 border-gray-700">
      <HeaderProfile user={userProfile} />
    </div>
  );
};

export default HeaderMain;
