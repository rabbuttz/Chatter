import { getSellerById } from "@ichijiuke/db";
import { cookies } from "next/headers";

import {
  getRequiredProductionEnv,
  isDemoFallbackEnabled,
  isProductionPersistenceEnabled,
} from "@/lib/env";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  APP_SESSION_COOKIE,
  createSessionToken,
  type AppSessionPayload,
  getSessionMaxAge,
  verifySessionToken,
} from "@/lib/session-token";

export { hashPassword, verifyPassword };

export const DEMO_SESSION_COOKIE = APP_SESSION_COOKIE;

export type DemoSession = AppSessionPayload;

function encodeLegacySession(session: DemoSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

function decodeLegacySession(value: string) {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));

    if (
      typeof parsed?.sellerId !== "string" ||
      typeof parsed?.displayName !== "string" ||
      typeof parsed?.email !== "string" ||
      typeof parsed?.sellerType !== "string" ||
      typeof parsed?.createdAt !== "string"
    ) {
      return null;
    }

    return parsed as DemoSession;
  } catch {
    return null;
  }
}

export function createSellerId(email: string) {
  return (
    email
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/^-+|-+$/g, "") || `seller-${Date.now()}`
  );
}

export function normalizeDisplayName(email: string, displayName?: string) {
  if (displayName?.trim()) {
    return displayName.trim();
  }

  return email.split("@")[0] || "seller";
}

export function resolveRedirectPath(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

export function isProductionAuthEnabled() {
  return isProductionPersistenceEnabled();
}

export { isDemoFallbackEnabled };

export async function getDemoSession() {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(DEMO_SESSION_COOKIE)?.value;

  if (!rawValue) {
    return null;
  }

  if (!isProductionAuthEnabled()) {
    return isDemoFallbackEnabled() ? decodeLegacySession(rawValue) : null;
  }

  const payload = await verifySessionToken(rawValue);

  if (!payload) {
    return null;
  }

  getRequiredProductionEnv();
  const seller = await getSellerById(payload.sellerId);

  if (!seller) {
    return null;
  }

  return {
    sellerId: seller.id,
    createdAt: payload.createdAt,
    displayName: seller.displayName,
    email: seller.email,
    sellerType: seller.sellerType,
  } satisfies DemoSession;
}

export async function setDemoSession(session: DemoSession) {
  const cookieStore = await cookies();
  const token = isProductionAuthEnabled()
    ? await createSessionToken(session)
    : encodeLegacySession(session);

  if (!token) {
    throw new Error("Failed to create session token.");
  }

  cookieStore.set(DEMO_SESSION_COOKIE, token, {
    httpOnly: true,
    maxAge: isProductionAuthEnabled() ? getSessionMaxAge() : 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearDemoSession() {
  const cookieStore = await cookies();

  cookieStore.set(DEMO_SESSION_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function buildSessionFromCredentials(input: {
  sellerId?: string;
  email: string;
  displayName?: string;
  sellerType: "physical" | "digital" | "hybrid";
}) {
  return {
    sellerId: input.sellerId ?? createSellerId(input.email),
    createdAt: new Date().toISOString(),
    displayName: normalizeDisplayName(input.email, input.displayName),
    email: input.email.toLowerCase(),
    sellerType: input.sellerType,
  } satisfies DemoSession;
}

export function getRequiredAuthEnv() {
  return getRequiredProductionEnv();
}
