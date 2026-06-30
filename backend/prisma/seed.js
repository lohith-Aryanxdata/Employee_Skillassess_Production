const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log("🚀 Starting database cleanup and synchronization...");

  try {
    // ⚠️ IMPORTANT: These names must match your schema.prisma model names exactly.
    // If you get an error that 'prisma.user' is not a function, try 'prisma.users'.
    await prisma.response.deleteMany({});
    await prisma.testAttempt.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("🧹 Previous data cleared from users, responses, and test_attempts.");

    // 2. Define your specific Admins
    const admins = [
      { name: "Main Admin", email: "admin@sceniuz.com", password: "Admin@123!" },
      { name: "Secondary Admin", email: "admin2@sceniuz.com", password: "Admin@1234" },
    ];

    for (const admin of admins) {
      const hash = await bcrypt.hash(admin.password, SALT_ROUNDS);
      await prisma.user.create({
        data: {
          name: admin.name,
          email: admin.email.toLowerCase().trim(),
          passwordHash: hash,
          role: "ADMIN"
        },
      });
      console.log(`✅ Admin created: ${admin.email}`);
    }

    // 3. Define your specific Employees
    const employees = [
      { name: "Lohith Aryan S", email: "Aryan@sceniuz.com", password: "Employee@123!", department: "DATA ANALYTICS" },
      { name: "Diego Maradona", email: "Maradona@sceniuz.com", password: "Employee@456!", department: "DATA ANALYTICS" },
    ];

    for (const emp of employees) {
      const hash = await bcrypt.hash(emp.password, SALT_ROUNDS);
      await prisma.user.create({
        data: {
          name: emp.name,
          email: emp.email.toLowerCase().trim(),
          passwordHash: hash,
          role: "EMPLOYEE"
        },
      });
      console.log(`✅ Employee created: ${emp.email}`);
    }

    console.log("\n🎉 Database sync complete. 'questions' table was left untouched.");

  } catch (error) {
    console.error("❌ Error during synchronization:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();