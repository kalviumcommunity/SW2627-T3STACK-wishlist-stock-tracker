import { NextResponse } from "next/server";
import { getDb, generateId } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getSessionUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    const items = db.prepare("SELECT * FROM wishlist_items WHERE user_id = ? ORDER BY created_at DESC").all(userId);
    // Map snake_case to camelCase for frontend
    const mapped = (items as any[]).map((row) => ({
      id: row.id,
      userId: row.user_id,
      productName: row.product_name,
      price: row.price,
      imageUrl: row.image_url,
      brand: row.brand,
      inStock: Boolean(row.in_stock),
      createdAt: row.created_at,
    }));
    return NextResponse.json(mapped);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getSessionUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { productName, price, imageUrl, brand } = body;
    if (!productName || price == null) {
      return NextResponse.json({ error: "productName and price are required" }, { status: 400 });
    }
    const id = generateId();
    const db = getDb();
    db.prepare(
      `INSERT INTO wishlist_items (id, user_id, product_name, price, image_url, brand)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(id, userId, productName, price, imageUrl || null, brand || null);

    return NextResponse.json({
      id,
      userId,
      productName,
      price,
      imageUrl: imageUrl || null,
      brand: brand || null,
      inStock: true,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
