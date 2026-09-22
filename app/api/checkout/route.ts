import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

function getAuthenticatedUserId(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getPrisma();

    const result = await prisma.$transaction(async (tx) => {
      // Get the user's cart
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: { product: true }
          }
        }
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      // Check stock and decrement
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw Object.assign(new Error(`Insufficient stock for ${item.product.name}`), {
            code: "INSUFFICIENT_STOCK",
          });
        }
      }

      // Decrement stock for all items
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // Clear the cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return { success: true };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Checkout failed:", error);
    if (error.code === "INSUFFICIENT_STOCK") {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || "Checkout failed" }, { status: 500 });
  }
}
