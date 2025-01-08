import React from "react";

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import HeaderProfile from "./HeaderProfile";
import { authOptions } from "@/lib/authOptions";

const HeaderMain = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="bg-gray-900 h-full py-3 px-8 flex justify-end items-center border-b-1 border-gray-700">
      <HeaderProfile user={session.user} />
    </div>
  );
};

export default HeaderMain;
