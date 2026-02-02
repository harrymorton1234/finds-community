import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create moderator account
  const passwordHash = await bcrypt.hash("Jlsc0m1234", 12);

  const moderator = await prisma.user.upsert({
    where: { email: "morton_h1@icloud.com" },
    update: {
      name: "Harry Morton",
      role: "moderator",
    },
    create: {
      name: "Harry Morton",
      email: "morton_h1@icloud.com",
      passwordHash,
      role: "moderator",
    },
  });

  console.log("Created moderator:", moderator.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
