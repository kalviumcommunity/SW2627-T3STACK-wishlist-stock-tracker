import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const db = getDb();

    // Fetch the user's name (don't expose email or password hash)
    const user = db
      .prepare("SELECT name FROM users WHERE id = ?")
      .get(userId) as any;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch their wishlist items
    const items = db
      .prepare("SELECT * FROM wishlist_items WHERE user_id = ? ORDER BY created_at DESC")
      .all(userId);

    const mappedItems = (items as any[]).map((row) => ({
      id: row.id,
      productName: row.product_name,
      price: row.price,
      imageUrl: row.image_url,
      brand: row.brand,
      inStock: Boolean(row.in_stock),
      createdAt: row.created_at,
    }));

    return NextResponse.json({
      ownerName: user.name,
      items: mappedItems,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
