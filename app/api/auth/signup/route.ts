import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { getDb, generateId } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
      return NextResponse.json(
        { error: "Name, valid email, and password of at least 8 characters are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    }

    const id = generateId();
    const passwordHash = await hash(password, 12);
    db.prepare(
      "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)"
    ).run(id, name, email, passwordHash);

    return NextResponse.json(
      { message: "User registered successfully", user: { id, name, email } },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: "Unable to register user" }, { status: 500 });
  }
}