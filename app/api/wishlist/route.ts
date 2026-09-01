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
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      wishlistItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        price: Number(item.product.price),
        image: item.product.image,
        stock: item.product.stock,
        createdAt: item.createdAt,
      })),
    );
  } catch (error) {
    console.error("Wishlist fetch failed:", error);
    return NextResponse.json({ error: "Unable to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const productId = typeof body?.productId === "string" ? body.productId : "";

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const prisma = getPrisma();
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This product is already in your wishlist" },
        { status: 409 },
      );
    }

    const saved = await prisma.wishlist.create({
      data: { userId, productId },
      include: { product: true },
    });

    return NextResponse.json(
      {
        id: saved.id,
        productId: saved.productId,
        productName: saved.product.name,
        price: Number(saved.product.price),
        image: saved.product.image,
        stock: saved.product.stock,
        createdAt: saved.createdAt,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Wishlist add failed:", error);
    return NextResponse.json({ error: "Unable to add product to wishlist" }, { status: 500 });
  }
}
