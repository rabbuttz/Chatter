"use server";

import { redirect } from "next/navigation";

import { sellerTypeValues } from "@ichijiuke/domain";

import {
  clearDemoSession,
  normalizeDisplayName,
  resolveRedirectPath,
  setDemoSession,
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

export async function loginDemoAction(formData: FormData) {
  const email = getFormValue(formData, "email");
  const displayName = getFormValue(formData, "displayName");
  const nextPath = resolveRedirectPath(getFormValue(formData, "next"));

  if (!email) {
    redirect(`/login?error=missing_email&next=${encodeURIComponent(nextPath)}`);
  }

  await setDemoSession({
    createdAt: new Date().toISOString(),
    displayName: normalizeDisplayName(email, displayName),
    email,
    sellerType: "hybrid",
  });

  redirect(nextPath as never);
}

export async function signupDemoAction(formData: FormData) {
  const email = getFormValue(formData, "email");
  const displayName = getFormValue(formData, "displayName");
  const sellerType = resolveSellerType(getFormValue(formData, "sellerType"));

  if (!email) {
    redirect("/signup?error=missing_email");
  }

  await setDemoSession({
    createdAt: new Date().toISOString(),
    displayName: normalizeDisplayName(email, displayName),
    email,
    sellerType,
  });

  redirect("/setup");
}

export async function logoutDemoAction() {
  await clearDemoSession();
  redirect("/");
}
