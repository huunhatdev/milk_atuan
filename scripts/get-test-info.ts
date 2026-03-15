import prisma from "../src/lib/prisma"
import { signAccessToken } from "../src/lib/auth"
import { Role } from "../src/constants/roles"
import fs from "fs"

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: Role.ADMIN },
  })

  if (!admin) {
    console.error("No admin user found. Run yarn db:seed first.")
    process.exit(1)
  }

  const token = signAccessToken({
    userId: admin.id,
    username: admin.username,
    role: admin.role as Role,
  })

  fs.writeFileSync("test_token.txt", token)
  console.log("Token saved to test_token.txt")

  const service = await prisma.service.findFirst()
  console.log("SERVICE_ID=" + service?.id)
  console.log("SERVICE_CODE=" + service?.code)

  const order = await prisma.order.findFirst()
  console.log("ORDER_ID=" + order?.id)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
