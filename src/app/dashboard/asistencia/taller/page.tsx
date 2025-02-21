import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
const Page = async() => {
  redirect("/dashboard/asistencia");
};

export default Page;
