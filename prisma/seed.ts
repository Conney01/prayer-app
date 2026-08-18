import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { slug: "daily-prayers", name: "Daily Prayers", icon: "sun", sortOrder: 1 },
  { slug: "forgiveness-repentance", name: "Forgiveness, Repentance & Reconciliation", icon: "heart-handshake", sortOrder: 2 },
  { slug: "difficult-emotions", name: "Difficult Emotions", icon: "cloud-rain", sortOrder: 3 },
  { slug: "anxiety-worry-stress", name: "Anxiety, Worry & Stress", icon: "wind", sortOrder: 4 },
  { slug: "school-studies-exams", name: "School, Studies & Exams", icon: "graduation-cap", sortOrder: 5 },
  { slug: "work-career-business", name: "Work, Career & Business", icon: "briefcase", sortOrder: 6 },
  { slug: "financial-difficulties", name: "Financial Difficulties", icon: "coins", sortOrder: 7 },
  { slug: "family", name: "Family", icon: "users", sortOrder: 8 },
  { slug: "love-relationships", name: "Love & Relationships", icon: "heart", sortOrder: 9 },
  { slug: "health-healing", name: "Health & Healing", icon: "activity", sortOrder: 10 },
  { slug: "protection-safety", name: "Protection & Safety", icon: "shield", sortOrder: 11 },
  { slug: "guidance-decisions", name: "Guidance & Important Decisions", icon: "compass", sortOrder: 12 },
  { slug: "difficult-times-hardships", name: "Difficult Times & Hardships", icon: "anchor", sortOrder: 13 },
  { slug: "gratitude-thanksgiving", name: "Gratitude & Thanksgiving", icon: "sparkles", sortOrder: 14 },
  { slug: "special-occasions", name: "Special Occasions", icon: "calendar", sortOrder: 15 },
  { slug: "spiritual-growth", name: "Spiritual Growth", icon: "feather", sortOrder: 16 },
];

async function main() {
  console.log("Seeding categories...");
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, sortOrder: cat.sortOrder },
      create: cat,
    });
  }
  console.log("âœ“ Categories seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });