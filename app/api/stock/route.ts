import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

function getAuthenticatedUserId(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function GET(request: NextRequest) {
  const userId = getAuthenticatedUserId(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wishlistProducts = await getPrisma().wishlist.findMany({
      where: { userId },
      select: {
        productId: true,
        product: {
          select: {
            stock: true,
          },
        },
      },
    });

    return NextResponse.json(
      wishlistProducts.map(({ productId, product }) => ({
        productId,
        stock: product.stock,
      })),
    );
  } catch (error) {
    console.error("Wishlist stock check failed:", error);
    return NextResponse.json({ error: "Unable to check wishlist stock" }, { status: 500 });
  }
}
