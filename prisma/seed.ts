import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@themortgageplatform.com" },
    update: {},
    create: {
      email: "admin@themortgageplatform.com",
      password: hashedPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  const applicant1 = await prisma.user.upsert({
    where: { email: "john.doe@example.com" },
    update: {},
    create: {
      email: "john.doe@example.com",
      password: hashedPassword,
      name: "John Doe",
      role: "APPLICANT",
    },
  });

  const applicant2 = await prisma.user.upsert({
    where: { email: "jane.smith@example.com" },
    update: {},
    create: {
      email: "jane.smith@example.com",
      password: hashedPassword,
      name: "Jane Smith",
      role: "APPLICANT",
    },
  });

  const lender1 = await prisma.user.upsert({
    where: { email: "lender@bankone.com" },
    update: {},
    create: {
      email: "lender@bankone.com",
      password: hashedPassword,
      name: "Bank One Lender",
      role: "LENDER",
    },
  });

  const lender2 = await prisma.user.upsert({
    where: { email: "lender@creditunion.com" },
    update: {},
    create: {
      email: "lender@creditunion.com",
      password: hashedPassword,
      name: "Credit Union Lender",
      role: "LENDER",
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("\n📝 Test users created:");
  console.log("Admin: admin@themortgageplatform.com / password123");
  console.log("Applicant 1: john.doe@example.com / password123");
  console.log("Applicant 2: jane.smith@example.com / password123");
  console.log("Lender 1: lender@bankone.com / password123");
  console.log("Lender 2: lender@creditunion.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
