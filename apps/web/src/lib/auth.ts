import { cookies } from "next/headers";

export const DEMO_SESSION_COOKIE = "ichijiuke_demo_session";

export type DemoSession = {
  createdAt: string;
  displayName: string;
  email: string;
  sellerType: "physical" | "digital" | "hybrid";
};

function encodeSession(session: DemoSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

function decodeSession(value: string) {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));

    if (
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

export function normalizeDisplayName(email: string, displayName?: string) {
  if (displayName?.trim()) {
    return displayName.trim();
  }

  return email.split("@")[0] || "demo-seller";
}

export function resolveRedirectPath(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

export async function getDemoSession() {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(DEMO_SESSION_COOKIE)?.value;

  if (!rawValue) {
    return null;
  }

  return decodeSession(rawValue);
}

export async function setDemoSession(session: DemoSession) {
  const cookieStore = await cookies();

  cookieStore.set(DEMO_SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
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
