import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json(await getPrisma().wishlistItem.delete({ where: { id } }));
}
