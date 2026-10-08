import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { ensureSeeded } from "./seed";

const COOKIE = "jomer_admin";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 días

async function getSetting(key: string): Promise<string | null> {
  await ensureSeeded();
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return rows[0]?.value ?? null;
}

async function setSetting(key: string, value: string): Promise<void> {
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
}

async function getSecret(): Promise<string> {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  const existing = await getSetting("__session_secret");
  if (existing) return existing;
  const fresh = crypto.randomBytes(32).toString("hex");
  await db.insert(settings).values({ key: "__session_secret", value: fresh }).onConflictDoNothing();
  return (await getSetting("__session_secret")) ?? fresh;
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

export function passwordFromEnv(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export async function hasPassword(): Promise<boolean> {
  if (passwordFromEnv()) return true;
  return Boolean(await getSetting("__admin_password"));
}

function hashPassword(pw: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyHash(pw: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const computed = crypto.scryptSync(pw, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return expected.length === computed.length && crypto.timingSafeEqual(expected, computed);
}

export async function checkPassword(pw: string): Promise<boolean> {
  if (process.env.ADMIN_PASSWORD) return safeEqual(pw, process.env.ADMIN_PASSWORD);
  const stored = await getSetting("__admin_password");
  return stored ? verifyHash(pw, stored) : false;
}

export async function setPassword(pw: string): Promise<void> {
  await setSetting("__admin_password", hashPassword(pw));
  // Rota el secreto: cierra todas las sesiones anteriores
  if (!process.env.SESSION_SECRET) {
    await setSetting("__session_secret", crypto.randomBytes(32).toString("hex"));
  }
}

export async function createSession(): Promise<void> {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = `admin.${exp}`;
  const token = `${payload}.${sign(payload, await getSecret())}`;
  const h = await headers();
  const secure = h.get("x-forwarded-proto") === "https";
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
    secure,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  try {
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return false;
    const idx = token.lastIndexOf(".");
    if (idx <= 0) return false;
    const payload = token.slice(0, idx);
    const sig = token.slice(idx + 1);
    const [role, expStr] = payload.split(".");
    if (role !== "admin" || !(Number(expStr) > Date.now())) return false;
    return safeEqual(sig, sign(payload, await getSecret()));
  } catch {
    return false;
  }
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
