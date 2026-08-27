import { NextResponse } from "next/server";
import { getDb, generateId } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getSessionUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    const items = db.prepare("SELECT * FROM cart_items WHERE user_id = ? ORDER BY created_at DESC").all(userId);
    const mapped = (items as any[]).map((row) => ({
      id: row.id,
      productName: row.product_name,
      price: row.price,
      imageUrl: row.image_url,
      brand: row.brand,
      quantity: row.quantity,
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
    const { productName, price, imageUrl, brand, quantity } = body;
    if (!productName || price == null) {
      return NextResponse.json({ error: "productName and price are required" }, { status: 400 });
    }
    
    const db = getDb();
    
    // Check if item already exists
    const existing = db.prepare(
      "SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_name = ?"
    ).get(userId, productName) as any;
    
    const qtyToAdd = quantity || 1;

    if (existing) {
      db.prepare(
        "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?"
      ).run(qtyToAdd, existing.id);
      return NextResponse.json({ id: existing.id, productName, price, imageUrl, brand, quantity: existing.quantity + qtyToAdd }, { status: 200 });
    } else {
      const id = generateId();
      db.prepare(
        `INSERT INTO cart_items (id, user_id, product_name, price, image_url, brand, quantity)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(id, userId, productName, price, imageUrl || null, brand || null, qtyToAdd);
      return NextResponse.json({ id, productName, price, imageUrl, brand, quantity: qtyToAdd }, { status: 201 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await getSessionUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, quantity } = body;
    if (!id || quantity == null) {
      return NextResponse.json({ error: "id and quantity are required" }, { status: 400 });
    }
    
    if (quantity <= 0) {
      return NextResponse.json({ error: "quantity must be greater than 0" }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?").run(quantity, id, userId);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, quantity });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getSessionUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const db = getDb();
    const result = db.prepare("DELETE FROM cart_items WHERE id = ? AND user_id = ?").run(id, userId);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
