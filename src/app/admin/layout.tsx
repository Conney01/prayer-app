import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // The Master Lock: Kick them all the way out to the public landing page
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return <>{children}</>;
}