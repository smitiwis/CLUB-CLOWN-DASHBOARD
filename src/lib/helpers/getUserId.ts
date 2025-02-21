
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../authOptions";

export const dynamic = 'force-dynamic';

export const getUserId = async () => {
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user.id || null;
};

