import { PrismaClient } from "@prisma/client";
import { INTERESTS } from "../lib/mock-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding interests...");
  for (const interest of INTERESTS) {
    await prisma.interest.upsert({
      where: { slug: interest.slug },
      update: { label: interest.label, emoji: interest.emoji },
      create: { slug: interest.slug, label: interest.label, emoji: interest.emoji },
    });
  }
  console.log(`Seeded ${INTERESTS.length} interests.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
