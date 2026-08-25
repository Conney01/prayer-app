import { db } from "~/server/db";
import { AdminManager } from "./admin-manager";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const categories = await db.category.findMany({
    include: {
      situations: {
        include: {
          prayers: {
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
      prayers: {
        where: { situationId: null },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return <AdminManager initialCategories={categories} />;
}