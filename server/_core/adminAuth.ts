import { createHash, timingSafeEqual } from "node:crypto";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./env";

export const ADMIN_SESSION_COOKIE = "portfolio_admin_session";

const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const attemptsByIp = new Map<string, { count: number; expiresAt: number }>();

function secretKey(secret: string): Uint8Array {
  if (Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("JWT_SECRET must contain at least 32 bytes.");
  }
  return new TextEncoder().encode(secret);
}

export function verifyAdminPassword(candidate: string, expected: string) {
  const candidateDigest = createHash("sha256").update(candidate).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(candidateDigest, expectedDigest);
}

export async function signAdminSession(secret: string) {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("portfolio-admin")
    .setAudience("portfolio-admin")
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_TTL_SECONDS}s`)
    .sign(secretKey(secret));
}

export async function isValidAdminSession(req: Request) {
  const token = parseCookieHeader(req.headers.cookie ?? "")[ADMIN_SESSION_COOKIE];
  if (!token) return false;

  if (!ENV.cookieSecret) return false;

  try {
    const { payload } = await jwtVerify(token, secretKey(ENV.cookieSecret), {
      issuer: "portfolio-admin",
      audience: "portfolio-admin",
    });
    return payload.admin === true;
  } catch {
    return false;
  }
}

function activeAttempts(ip: string, now = Date.now()) {
  const attempt = attemptsByIp.get(ip);
  if (!attempt || attempt.expiresAt <= now) {
    attemptsByIp.delete(ip);
    return undefined;
  }
  return attempt;
}

export function isAdminLoginRateLimited(ip: string, now = Date.now()) {
  return (activeAttempts(ip, now)?.count ?? 0) >= MAX_FAILED_ATTEMPTS;
}

export function recordFailedAdminLogin(ip: string, now = Date.now()) {
  for (const [knownIp, attempt] of attemptsByIp) {
    if (attempt.expiresAt <= now) attemptsByIp.delete(knownIp);
  }
  if (!attemptsByIp.has(ip) && attemptsByIp.size >= 10_000) {
    const oldestIp = attemptsByIp.keys().next().value;
    if (oldestIp) attemptsByIp.delete(oldestIp);
  }
  const attempt = activeAttempts(ip, now);
  if (attempt) {
    attempt.count += 1;
  } else {
    attemptsByIp.set(ip, { count: 1, expiresAt: now + LOGIN_WINDOW_MS });
  }
}

export function clearAdminLoginAttempts(ip: string) {
  attemptsByIp.delete(ip);
}
