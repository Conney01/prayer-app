import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch the user's session securely on the server
  const session = await auth();

  // 2. The Master Lock: If they aren't logged in, or aren't an ADMIN, kick them out
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // 3. If they are an ADMIN, let them see the page
  return <>{children}</>;
}