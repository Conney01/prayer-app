import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Migrating situations into Database...");
  const prayers = await db.prayer.findMany();

  for (const prayer of prayers) {
    const baseSituationName = prayer.title.split(/ [-—] /)[0]?.trim();
    if (!baseSituationName) continue;

    const situationSlug = baseSituationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const situation = await db.situation.upsert({
      where: {
        categoryId_slug: {
          categoryId: prayer.categoryId,
          slug: situationSlug,
        },
      },
      update: {
        name: baseSituationName,
      },
      create: {
        name: baseSituationName,
        slug: situationSlug,
        categoryId: prayer.categoryId,
      },
    });

    await db.prayer.update({
      where: { id: prayer.id },
      data: { situationId: situation.id },
    });
  }

  console.log("Migration complete: All existing situations and prayers linked in DB!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await db.$disconnect();
    process.exit(0);
  });