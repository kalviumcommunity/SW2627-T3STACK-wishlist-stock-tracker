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
        imageUrl: item.product.image,
        brand: "Unknown",
        inStock: item.product.stock > 0,
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
    let fallbackId = "";
    if (typeof body?.id === "string") fallbackId = body.id.trim();
    const productId = typeof body?.productId === "string" ? body.productId.trim() : fallbackId;
    
    // Fallback for frontend that might send productName, price
    const productName = body?.productName || "Unknown Product";
    const price = body?.price || 0;
    const imageUrl = body?.imageUrl || "";

    if (!productId) {
      // In case frontend only sends productName
      if (body?.productName) {
        return NextResponse.json({ error: "Product ID is required (mapped to id)" }, { status: 400 });
      }
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const prisma = getPrisma();
    
    // Upsert product so frontend static products don't break
    const product = await prisma.product.upsert({
      where: { id: productId },
      update: {},
      create: {
        id: productId,
        name: productName,
        price: price,
        image: imageUrl,
        stock: 10, // Default stock for static products
      }
    });

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
        userId: saved.userId,
        productId: saved.productId,
        productName: saved.product.name,
        price: Number(saved.product.price),
        imageUrl: saved.product.image,
        inStock: saved.product.stock > 0,
        createdAt: saved.createdAt,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Wishlist add failed:", error);
    return NextResponse.json({ error: "Unable to add product to wishlist" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("id");

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const prisma = getPrisma();
    
    // Check if itemId is a wishlist item ID or product ID
    let itemToDelete = await prisma.wishlist.findFirst({
      where: { id: itemId, userId },
    });
    
    if (!itemToDelete) {
      // Try to find by productId since frontend might send productId
      itemToDelete = await prisma.wishlist.findFirst({
        where: { productId: itemId, userId },
      });
    }

    if (!itemToDelete) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await prisma.wishlist.delete({
      where: { id: itemToDelete.id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Wishlist item removal failed:", error);
    return NextResponse.json({ error: "Unable to remove wishlist item" }, { status: 500 });
  }
}
