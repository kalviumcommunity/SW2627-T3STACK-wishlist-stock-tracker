import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getSessionUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    const items = db.prepare("SELECT * FROM wishlist_items WHERE user_id = ? ORDER BY created_at DESC").all(userId);
    const mapped = (items as any[]).map((row) => ({
      id: row.id,
      productName: row.product_name,
      price: row.price,
      imageUrl: row.image_url,
      brand: row.brand,
      inStock: Boolean(row.in_stock),
      createdAt: row.created_at,
    }));

    const totalItems = mapped.length;
    const inStockCount = mapped.filter((i) => i.inStock).length;
    const outOfStockCount = totalItems - inStockCount;

    return NextResponse.json({
      items: mapped,
      stats: { totalItems, inStockCount, outOfStockCount },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
