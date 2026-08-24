import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

function invalidInput(name: unknown, email: unknown, password: unknown) {
  return (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    typeof email !== "string" ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    typeof password !== "string" ||
    password.length < 8
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body as {
      name?: unknown;
      email?: unknown;
      password?: unknown;
    };
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (invalidInput(name, normalizedEmail, password)) {
      return NextResponse.json(
        { error: "Name, valid email, and password of at least 8 characters are required" },
        { status: 400 },
      );
    }

    const prisma = getPrisma();
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        name: (name as string).trim(),
        email: normalizedEmail,
        passwordHash: await hash(password as string, 12),
      },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Unable to register user" }, { status: 500 });
  }
}