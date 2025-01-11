import React from "react";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import HeaderProfile from "./HeaderProfile";
import { authOptions } from "@/lib/authOptions";
import { fetchProfileById } from "@/lib/usuarios/services";

const HeaderMain = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const profile = await fetchProfileById(session.user.id);
  if (!profile) redirect("/login");

  const userProfile = {
    name: profile.nombre,
    rolName: profile.rol.nombre,
  }

  return (
    <div className="bg-gray-900 h-full py-3 px-8 flex justify-end items-center border-b-1 border-gray-700">
      <HeaderProfile
        user={userProfile}
      />
    </div>
  );
};

export default HeaderMain;
