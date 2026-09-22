import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const prisma = getPrisma();

    // Fetch the user's name
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch their wishlist items
    const items = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    const mappedItems = items.map((item) => ({
      id: item.id,
      productName: item.product.name,
      price: Number(item.product.price),
      imageUrl: item.product.image,
      brand: "Unknown",
      inStock: item.product.stock > 0,
      createdAt: item.createdAt,
    }));

    return NextResponse.json({
      ownerName: user.name,
      items: mappedItems,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
