import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPrisma } from "@/lib/prisma";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const prisma = getPrisma();
    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productName, price, imageUrl, brand } = body;

    if (!productName || typeof price !== "number") {
      return NextResponse.json({ error: "Product name and price are required" }, { status: 400 });
    }

    const prisma = getPrisma();
    const item = await prisma.wishlistItem.create({
      data: {
        userId,
        productName,
        price,
        imageUrl: imageUrl || null,
        brand: brand || null,
      },
    });

    return NextResponse.json({ message: "Item added to wishlist", item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add item to wishlist" }, { status: 500 });
  }
}
