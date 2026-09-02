import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

function getAuthenticatedUserId(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

function normalizeQuantity(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isInteger(value) && value > 0 ? value : null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const parsed = Number(trimmed);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getPrisma();
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({
      items: cart.items.map((item) => ({
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          image: item.product.image,
          stock: item.product.stock,
        },
      })),
    });
  } catch (error) {
    console.error("Cart fetch failed:", error);
    return NextResponse.json({ error: "Unable to fetch cart" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const itemId = typeof body?.id === "string" ? body.id.trim() : "";
    const quantity = normalizeQuantity(body?.quantity);

    if (!itemId) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 });
    }

    if (!quantity) {
      return NextResponse.json(
        { error: "Quantity must be a positive integer" },
        { status: 400 },
      );
    }

    const prisma = getPrisma();
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    if (!cartItem.product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (cartItem.product.stock === 0) {
      return NextResponse.json(
        { error: "This product is out of stock and cannot be added to the cart" },
        { status: 409 },
      );
    }

    if (quantity > cartItem.product.stock) {
      return NextResponse.json(
        {
          error: `Requested quantity exceeds available stock. Only ${cartItem.product.stock} item(s) available.`,
        },
        { status: 409 },
      );
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
      include: { product: true },
    });

    return NextResponse.json({
      id: updated.id,
      cartId: updated.cartId,
      productId: updated.productId,
      quantity: updated.quantity,
      product: {
        id: updated.product.id,
        name: updated.product.name,
        price: Number(updated.product.price),
        image: updated.product.image,
        stock: updated.product.stock,
      },
      message: "Cart item quantity updated",
    });
  } catch (error) {
    console.error("Cart item update failed:", error);
    return NextResponse.json({ error: "Unable to update cart item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const itemId = typeof body?.id === "string" ? body.id.trim() : "";

    if (!itemId) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 });
    }

    const prisma = getPrisma();
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    return NextResponse.json({
      message: "Cart item removed",
      itemId: cartItem.id,
      productId: cartItem.productId,
    });
  } catch (error) {
    console.error("Cart item removal failed:", error);
    return NextResponse.json({ error: "Unable to remove cart item" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getAuthenticatedUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const productId = typeof body?.productId === "string" ? body.productId.trim() : "";
    const quantity = normalizeQuantity(body?.quantity);

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    if (!quantity) {
      return NextResponse.json(
        { error: "Quantity must be a positive integer" },
        { status: 400 },
      );
    }

    const prisma = getPrisma();
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock === 0) {
      return NextResponse.json(
        { error: "This product is out of stock and cannot be added to the cart" },
        { status: 409 },
      );
    }

    if (quantity > product.stock) {
      return NextResponse.json(
        {
          error: `Requested quantity exceeds available stock. Only ${product.stock} item(s) available.`,
        },
        { status: 409 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      let cart = await tx.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        cart = await tx.cart.create({
          data: { userId },
        });
      }

      const existing = await tx.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });

      const finalQuantity = existing ? existing.quantity + quantity : quantity;

      if (finalQuantity > product.stock) {
        throw Object.assign(new Error("Requested quantity exceeds available stock."), {
          code: "INSUFFICIENT_STOCK",
        });
      }

      if (existing) {
        const updated = await tx.cartItem.update({
          where: { id: existing.id },
          data: {
            quantity: finalQuantity,
          },
          include: { product: true },
        });

        return {
          item: updated,
          created: false,
        };
      }

      const created = await tx.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: { product: true },
      });

      return {
        item: created,
        created: true,
      };
    });

    return NextResponse.json(
      {
        id: result.item.id,
        cartId: result.item.cartId,
        productId: result.item.productId,
        quantity: result.item.quantity,
        productName: result.item.product.name,
        price: Number(result.item.product.price),
        stock: result.item.product.stock,
        created: result.created,
      },
      { status: result.created ? 201 : 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to add product to cart";
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";

    if (code === "INSUFFICIENT_STOCK") {
      return NextResponse.json({ error: message }, { status: 409 });
    }

    console.error("Cart add failed:", error);
    return NextResponse.json({ error: "Unable to add product to cart" }, { status: 500 });
  }
}
