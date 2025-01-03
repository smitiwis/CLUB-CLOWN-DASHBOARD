import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";

export const getUserId = async () => {
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  return session.user.id || null;
};
