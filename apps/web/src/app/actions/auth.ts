"use server";

import { createSellerAccount, getSellerByEmail } from "@ichijiuke/db";
import { sellerTypeValues } from "@ichijiuke/domain";
import { redirect } from "next/navigation";

import {
  buildSessionFromCredentials,
  clearDemoSession,
  hashPassword,
  isDemoFallbackEnabled,
  isProductionAuthEnabled,
  normalizeDisplayName,
  resolveRedirectPath,
  setDemoSession,
  verifyPassword,
} from "@/lib/auth";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function resolveSellerType(value: string) {
  return sellerTypeValues.includes(value as (typeof sellerTypeValues)[number])
    ? (value as (typeof sellerTypeValues)[number])
    : "hybrid";
}

function requirePasswordForProduction(password: string, path: string) {
  if (isProductionAuthEnabled() && password.length < 12) {
    redirectTo(`${path}?error=weak_password`);
  }
}

function redirectTo(path: string): never {
  redirect(path as never);
}

export async function loginDemoAction(formData: FormData) {
  const email = getFormValue(formData, "email").toLowerCase();
  const displayName = getFormValue(formData, "displayName");
  const password = getFormValue(formData, "password");
  const nextPath = resolveRedirectPath(getFormValue(formData, "next"));

  if (!email) {
    redirectTo(`/login?error=missing_email&next=${encodeURIComponent(nextPath)}`);
  }

  if (isDemoFallbackEnabled()) {
    await setDemoSession(
      buildSessionFromCredentials({
        email,
        displayName,
        sellerType: "hybrid",
      }),
    );

    redirectTo(nextPath);
  }

  if (!isProductionAuthEnabled()) {
    redirectTo(`/login?error=auth_not_configured&next=${encodeURIComponent(nextPath)}`);
  }

  const seller = await getSellerByEmail(email);

  if (!seller || !verifyPassword(password, seller.passwordHash)) {
    redirectTo(`/login?error=invalid_credentials&next=${encodeURIComponent(nextPath)}`);
  }

  await setDemoSession(
    buildSessionFromCredentials({
      sellerId: seller.id,
      email: seller.email,
      displayName: seller.displayName,
      sellerType: seller.sellerType,
    }),
  );

  redirectTo(nextPath);
}

export async function signupDemoAction(formData: FormData) {
  const email = getFormValue(formData, "email").toLowerCase();
  const displayName = getFormValue(formData, "displayName");
  const sellerType = resolveSellerType(getFormValue(formData, "sellerType"));
  const password = getFormValue(formData, "password");

  if (!email) {
    redirectTo("/signup?error=missing_email");
  }

  if (isDemoFallbackEnabled()) {
    await setDemoSession(
      buildSessionFromCredentials({
        email,
        displayName,
        sellerType,
      }),
    );

    redirectTo("/setup");
  }

  if (!isProductionAuthEnabled()) {
    redirectTo("/signup?error=auth_not_configured");
  }

  requirePasswordForProduction(password, "/signup");

  const existingSeller = await getSellerByEmail(email);

  if (existingSeller) {
    redirectTo("/signup?error=email_exists");
  }

  const sellerId =
    email
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, "-")
      .replaceAll(/^-+|-+$/g, "") || `seller-${Date.now()}`;

  const createdSeller = await createSellerAccount({
    id: sellerId,
    displayName: normalizeDisplayName(email, displayName),
    email,
    passwordHash: hashPassword(password),
    sellerType,
    publicSlug: sellerId,
    publicStatus: "private_preview",
    setupCompleted: false,
    notificationEmail: email,
  });

  await setDemoSession(
    buildSessionFromCredentials({
      sellerId: createdSeller.id,
      email: createdSeller.email,
      displayName: createdSeller.displayName,
      sellerType: createdSeller.sellerType,
    }),
  );

  redirectTo("/setup");
}

export async function logoutDemoAction() {
  await clearDemoSession();
  redirectTo("/");
}
