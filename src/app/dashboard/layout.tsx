import { FC } from "react";
import HeaderMain from "@/components/header/HeaderMain";
import AsideMain from "@/components/navbar/AsideMain";
import { fetchProfileById } from "@/lib/usuarios/services";
// import SignOut from "./SignOut";
import SessionHandler from "../../components/session/SessionHandler";
import Providers from "./Provider";

interface Props {
  children: React.ReactNode;
}

const RootLayout: FC<Props> = async ({ children }) => {
  const profile = await fetchProfileById();

  const userProfile = {
    name: profile.nombre,
    rolName: profile.rol.nombre,
    callsPending: profile.callsPending,
  };

  return (
    <SessionHandler>
      <div
        className="grid grid-cols-[256px,1fr] grid-rows-1 min-h-screen"
        aria-hidden="false"
      >
        <AsideMain user={userProfile} />
        <div className="grid grid-cols-1 grid-rows-[70px,1fr] h-full overflow-y-auto">
          <HeaderMain />
          <main className="p-6 flex-1 bg-gray-950">
            <Providers>{children}</Providers>
          </main>
        </div>
      </div>
    </SessionHandler>
  );
};

export default RootLayout;
