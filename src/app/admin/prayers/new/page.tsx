import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { NewPrayerForm } from "./new-prayer-form";

export const dynamic = "force-dynamic";

export default async function NewPrayerPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const rawCategories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: {
      situations: {
        orderBy: { name: "asc" },
      },
    },
  });

  const initialCategories = rawCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    situations: cat.situations.map((s) => s.name),
  }));

  return <NewPrayerForm initialCategories={initialCategories} />;
}