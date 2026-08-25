import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json(await getPrisma().wishlistItem.findMany());
}

export async function POST(req: Request) {
  const data = await req.json();
  return NextResponse.json(await getPrisma().wishlistItem.create({ data }));
}
