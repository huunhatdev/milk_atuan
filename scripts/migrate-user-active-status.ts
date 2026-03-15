import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting migration: setting isActive = true for all users using raw command...")

  const result = await prisma.$runCommandRaw({
    update: "User",
    updates: [
      {
        q: {},
        u: { $set: { isActive: true } },
        multi: true
      }
    ]
  })

  console.log("Migration completed.", result)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
