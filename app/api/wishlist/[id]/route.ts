import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getSessionUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const db = getDb();
    
    // Only delete if it belongs to the user
    const result = db.prepare("DELETE FROM wishlist_items WHERE id = ? AND user_id = ?").run(id, userId);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
