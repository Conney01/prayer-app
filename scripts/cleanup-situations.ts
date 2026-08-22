import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("Cleaning up duplicate situations in the database...");
  
  const categories = await db.category.findMany({
    include: {
      situations: {
        include: { prayers: true },
      },
    },
  });

  for (const cat of categories) {
    const seenNames = new Map<string, string>(); // name -> keeperSituationId

    for (const sit of cat.situations) {
      const normalizedName = sit.name.trim();

      if (seenNames.has(normalizedName)) {
        const keeperId = seenNames.get(normalizedName)!;
        console.log(`Merging duplicate situation "${sit.name}" into master record...`);

        // Move all prayers from duplicate to keeper
        await db.prayer.updateMany({
          where: { situationId: sit.id },
          data: { situationId: keeperId },
        });

        // Delete duplicate situation
        await db.situation.delete({
          where: { id: sit.id },
        });
      } else {
        seenNames.set(normalizedName, sit.id);
      }
    }
  }

  console.log("Database situation cleanup complete: All duplicates removed!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await db.$disconnect();
    process.exit(0);
  });