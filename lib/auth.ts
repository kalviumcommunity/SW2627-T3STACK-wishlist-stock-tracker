import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "session";

function signingKey() {
  const key = process.env.AUTH_SECRET;
  if (!key) {
    throw new Error("AUTH_SECRET is not configured");
  }
  return key;
}

export function createSessionToken(userId: string) {
  const payload = Buffer.from(
    JSON.stringify({ userId, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 }),
  ).toString("base64url");
  const signature = createHmac("sha256", signingKey())
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string) {
  const [payload, encodedSignature] = token.split(".");
  if (!payload || !encodedSignature) return null;

  const expectedSignature = createHmac("sha256", signingKey())
    .update(payload)
    .digest("base64url");
  const actual = Buffer.from(encodedSignature);
  const expected = Buffer.from(expectedSignature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      userId?: string;
      expiresAt?: number;
    };
    return session.userId && session.expiresAt && session.expiresAt > Date.now()
      ? session.userId
      : null;
  } catch {
    return null;
  }
}
import { cookies } from "next/headers";
export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
