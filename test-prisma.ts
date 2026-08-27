import { PrismaClient } from "./app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

async function run() {
  const dbUrl = "file:./dev.db";
  const libsql = createClient({ url: dbUrl });
  const adapter = new PrismaLibSql(libsql);
  
  // Try passing the URL via datasources
  const prisma = new PrismaClient({ 
    adapter
  });

  try {
    const items = await prisma.wishlistItem.findMany();
    console.log("SUCCESS:", items.length);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

run();
