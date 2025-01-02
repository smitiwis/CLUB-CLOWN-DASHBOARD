import { Button, Link } from "@nextui-org/react";
import Image from "next/image";
import React, { FC } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

const AuthLayout: FC<Props> = async ({ children }) => {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="mx-auto flex flex-col h-screen">
      {/* NAVBAR INicial */}
      <div className="bg-gray-900 h-[4.5rem] border-b-1 border-gray-700 flex items-center">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <Image
                className="rounded-full"
                src={"/images/logo.jpg"}
                width={70}
                height={70}
                alt="logo"
              />
            </div>
            <div className="flex gap-x-4">
              <Button as={Link} color="primary" variant="ghost" href="/login">
                Login
              </Button>
              <Button
                as={Link}
                color="primary"
                variant="ghost"
                href="/register"
              >
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex-1 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
