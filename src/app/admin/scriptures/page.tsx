import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { ScriptureManager } from "./scripture-manager";

export const dynamic = "force-dynamic";

export default async function AdminScripturesPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const rawScriptures = await db.dailyScripture.findMany({
    orderBy: { date: "desc" },
    include: {
      prayer: {
        select: { id: true, title: true, slug: true },
      },
    },
    take: 20,
  });

  const rawPrayers = await db.prayer.findMany({
    where: { isPublished: true },
    orderBy: { title: "asc" },
    include: {
      category: { select: { name: true } },
    },
  });

  const prayers = rawPrayers.map((p) => ({
    id: p.id,
    title: p.title,
    categoryName: p.category.name,
  }));

  return <ScriptureManager scriptures={rawScriptures} prayers={prayers} />;
}