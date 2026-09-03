import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

function getAuthenticatedUserId(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getPrisma();
    
    // Fetch wishlist items with product details
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    const items = wishlistItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      price: Number(item.product.price),
      imageUrl: item.product.image,
      brand: "Unknown",
      inStock: item.product.stock > 0,
      stock: item.product.stock,
      createdAt: item.createdAt,
    }));

    const totalItems = items.length;
    const inStockCount = items.filter((i) => i.inStock).length;
    const outOfStockCount = totalItems - inStockCount;

    return NextResponse.json({
      items,
      stats: { totalItems, inStockCount, outOfStockCount },
    });
  } catch (error) {
    console.error("Stock fetch failed:", error);
    return NextResponse.json({ error: "Unable to fetch stock details" }, { status: 500 });
  }
}
