import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAdmin() {
  const adminUsername = "admin";
  const adminPassword = "AdminPassword123!"; // You should change this after first login

  console.log("🚀 Starting seeding admin user...");

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { username: adminUsername },
    });

    if (existingAdmin) {
      console.log("⚠️ Admin user already exists. Skipping creation.");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
        role: "ADMIN",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("✅ Admin user created successfully:");
    console.log(`   Username: ${admin.username}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Password: ${adminPassword} (Please change this immediately)`);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
