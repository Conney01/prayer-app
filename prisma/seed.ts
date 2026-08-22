import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  { name: "Forgiveness, Repentance & Reconciliation", slug: "forgiveness-repentance", sortOrder: 1 },
  { name: "School, Studies & Exams", slug: "school-studies-exams", sortOrder: 2 },
  { name: "Work, Career & Business", slug: "work-career-business", sortOrder: 3 },
  { name: "Financial Difficulties", slug: "financial-difficulties", sortOrder: 4 },
  { name: "Family", slug: "family", sortOrder: 5 },
  { name: "Love & Relationships", slug: "love-relationships", sortOrder: 6 },
  { name: "Health & Healing", slug: "health-healing", sortOrder: 7 },
  { name: "Protection & Safety", slug: "protection-safety", sortOrder: 8 },
  { name: "Guidance & Important Decisions", slug: "guidance-decisions", sortOrder: 9 },
  { name: "Difficult Times & Hardships", slug: "difficult-times-hardships", sortOrder: 10 },
  { name: "Gratitude & Thanksgiving", slug: "gratitude-thanksgiving", sortOrder: 11 },
];

async function main() {
  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: { name: cat.name, slug: cat.slug, sortOrder: cat.sortOrder },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });