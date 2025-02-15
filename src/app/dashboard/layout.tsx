import { FC } from "react";
import HeaderMain from "@/components/header/HeaderMain";
import AsideMain from "@/components/navbar/AsideMain";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { fetchProfileById } from "@/lib/usuarios/services";
import SignOut from "./SignOut";
import SessionHandler from "./SessionHandler";

interface Props {
  children: React.ReactNode;
}

const RootLayout: FC<Props> = async ({ children }) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) return <SignOut />;
  const id_usuario = session.user.id;
  const profile = await fetchProfileById(id_usuario);

  const userProfile = {
    name: profile.nombre,
    rolName: profile.rol.nombre,
    callsPending: profile.callsPending,
  };

  return (
    <SessionHandler>
      <div
        className="grid grid-cols-[256px,1fr] grid-rows-1 h-screen"
        aria-hidden="false"
      >
        <AsideMain user={userProfile} />
        <div className="grid grid-cols-1 grid-rows-[70px,1fr] h-full overflow-y-auto">
          <HeaderMain />
          <main className="p-6 flex-1 bg-gray-950">{children}</main>
        </div>
      </div>
    </SessionHandler>
  );
};

export default RootLayout;
