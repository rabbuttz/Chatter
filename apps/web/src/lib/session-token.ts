import { jwtVerify, SignJWT } from "jose";

import { getAppConfig, getRequiredProductionEnv } from "@/lib/env";

export const SESSION_COOKIE = "ichijiuke_session";
export const APP_SESSION_COOKIE = SESSION_COOKIE;

export type SessionPayload = {
  sellerId: string;
  createdAt: string;
  displayName: string;
  email: string;
  sellerType: "physical" | "digital" | "hybrid";
};
export type AppSessionPayload = SessionPayload;

export type VerifiedSessionPayload = SessionPayload & {
  iat?: number;
  exp?: number;
};

function getSessionKey() {
  return new TextEncoder().encode(getRequiredProductionEnv().sessionSecret);
}

export async function signSessionToken(payload: SessionPayload) {
  const { sessionMaxAgeSeconds } = getAppConfig();

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${sessionMaxAgeSeconds}s`)
    .sign(getSessionKey());
}

export const createSessionToken = signSessionToken;

export async function verifySessionToken(token: string) {
  try {
    const verified = await jwtVerify<SessionPayload>(token, getSessionKey(), {
      algorithms: ["HS256"],
    });

    return verified.payload as VerifiedSessionPayload;
  } catch {
    return null;
  }
}

export function getSessionMaxAge() {
  return getAppConfig().sessionMaxAgeSeconds;
}
