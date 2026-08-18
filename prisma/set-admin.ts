import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "pianella489@gmail.com".toLowerCase().trim() },
    update: { role: "ADMIN" },
    create: {
      email: "pianella489@gmail.com".toLowerCase().trim(),
      name: "Admin Curator",
      password: "",
      role: "ADMIN",
    },
  });
  console.log("✓ Successfully configured", user.email, "as ADMIN.");
}

main()
  .catch((e) => {
    console.error("Database error:", e.message);
  })
  .finally(() => prisma.$disconnect());