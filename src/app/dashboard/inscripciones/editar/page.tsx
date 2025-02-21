import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

const Page = async() => {
  redirect("/dashboard/inscripciones");
};

export default Page;
