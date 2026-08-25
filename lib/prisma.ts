import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrisma() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const libsql = createClient({
    url: process.env.DATABASE_URL || "file:./dev.db",
  });
  const adapter = new PrismaLibSQL(libsql);
  const prisma = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
  return prisma;
}