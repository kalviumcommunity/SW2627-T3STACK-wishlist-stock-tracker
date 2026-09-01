import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const userId = token ? verifySessionToken(token) : null;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!productId || typeof productId !== "string") {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const prisma = getPrisma();
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "This product is not in your wishlist" },
        { status: 404 },
      );
    }

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return NextResponse.json({
      message: "Product removed from wishlist",
      productId,
    });
  } catch (error) {
    console.error("Wishlist delete failed:", error);
    return NextResponse.json({ error: "Unable to remove product from wishlist" }, { status: 500 });
  }
}
