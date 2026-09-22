const { PrismaClient } = require("./prisma/generated/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.updateMany({
    where: { id: "1" },
    data: { image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400" }
  });
  await prisma.product.updateMany({
    where: { id: "2" },
    data: { image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400" }
  });
  await prisma.product.updateMany({
    where: { id: "3" },
    data: { image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=400" }
  });
  await prisma.product.updateMany({
    where: { id: "4" },
    data: { image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400" }
  });
  await prisma.product.updateMany({
    where: { id: "5" },
    data: { image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=400" }
  });
  await prisma.product.updateMany({
    where: { id: "6" },
    data: { image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=400" }
  });
  console.log("Updated database images.");
}
main().catch(console.error).finally(() => prisma.$disconnect());
