"use server";

import { revalidatePath } from "next/cache";

import {
  autoReplyToneValues,
  createDefaultSellerPolicies,
  handlingModeValues,
  knowledgeSourceStatusValues,
  knowledgeSourceTypeValues,
  notificationModeValues,
  publicStatusValues,
  sellerTypeValues,
} from "@ichijiuke/domain";

import { getDemoSession } from "@/lib/auth";
import { getDemoWorkspace, updateDemoWorkspace } from "@/lib/demo-workspace";

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function sanitizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "")
    .slice(0, 32) || "demo-shop";
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function starterButtonsFromPolicies<
  T extends { isEnabled: boolean; starterButtonLabel?: string | undefined },
>(policies: T[]) {
  return unique(
    policies
      .filter((policy) => policy.isEnabled && policy.starterButtonLabel)
      .map((policy) => policy.starterButtonLabel as string),
  ).slice(0, 6);
}

async function requireSession() {
  const session = await getDemoSession();

  if (!session) {
    throw new Error("Demo session is required.");
  }

  return session;
}

function revalidateWorkspacePaths(slug: string) {
  revalidatePath("/dashboard");
  revalidatePath("/setup");
  revalidatePath("/settings/intake");
  revalidatePath("/settings/knowledge");
  revalidatePath("/settings/notifications");
  revalidatePath("/settings/publish");
  revalidatePath("/inbox");
  revalidatePath(`/c/${slug}`);
  revalidatePath("/");
}

export async function saveSetupAction(formData: FormData) {
  const session = await requireSession();
  const nextSellerType = sellerTypeValues.includes(
    getValue(formData, "sellerType") as (typeof sellerTypeValues)[number],
  )
    ? (getValue(formData, "sellerType") as (typeof sellerTypeValues)[number])
    : session.sellerType;
  const nextTone = autoReplyToneValues.includes(
    getValue(formData, "autoReplyTone") as (typeof autoReplyToneValues)[number],
  )
    ? (getValue(formData, "autoReplyTone") as (typeof autoReplyToneValues)[number])
    : "warm";
  const resetPolicies = formData.get("resetPolicies") === "on";

  const workspace = await updateDemoWorkspace(session, (current) => {
    const templatePolicies = createDefaultSellerPolicies(nextSellerType);
    const sellerTypeChanged = current.settings.sellerType !== nextSellerType;
    const nextPolicies =
      sellerTypeChanged || resetPolicies
        ? templatePolicies.map((templatePolicy) => {
            const existing = current.settings.policies.find(
              (policy) => policy.categoryCode === templatePolicy.categoryCode,
            );

            return existing
              ? {
                  ...templatePolicy,
                  isEnabled: existing.isEnabled,
                  handlingMode: existing.handlingMode,
                  notificationMode: existing.notificationMode,
                  starterButtonLabel:
                    existing.starterButtonLabel ?? templatePolicy.starterButtonLabel,
                }
              : templatePolicy;
          })
        : current.settings.policies;
    const publicSlug = sanitizeSlug(
      getValue(formData, "publicSlug") || current.settings.publicSlug,
    );

    return {
      ...current,
      settings: {
        ...current.settings,
        shopName: getValue(formData, "shopName") || current.settings.shopName,
        sellerType: nextSellerType,
        publicSlug,
        autoReplyTone: nextTone,
        publicIntroMessage:
          getValue(formData, "publicIntroMessage") || current.settings.publicIntroMessage,
        scopeMessage: getValue(formData, "scopeMessage") || current.settings.scopeMessage,
        notificationEmail:
          getValue(formData, "notificationEmail") || current.settings.notificationEmail,
        policies: nextPolicies,
        starterButtons: starterButtonsFromPolicies(nextPolicies),
        setupCompleted: true,
      },
    };
  });

  revalidateWorkspacePaths(workspace.settings.publicSlug);
}

export async function saveIntakePoliciesAction(formData: FormData) {
  const session = await requireSession();
  const workspace = await getDemoWorkspace(session);
  const nextPolicies = workspace.settings.policies.map((policy) => {
    const nextHandling = getValue(formData, `handling:${policy.categoryCode}`);
    const nextNotification = getValue(formData, `notification:${policy.categoryCode}`);
    const nextStarter = getValue(formData, `starter:${policy.categoryCode}`);

    return {
      ...policy,
      isEnabled: formData.get(`enabled:${policy.categoryCode}`) === "on",
      handlingMode: handlingModeValues.includes(
        nextHandling as (typeof handlingModeValues)[number],
      )
        ? (nextHandling as (typeof handlingModeValues)[number])
        : policy.handlingMode,
      notificationMode: notificationModeValues.includes(
        nextNotification as (typeof notificationModeValues)[number],
      )
        ? (nextNotification as (typeof notificationModeValues)[number])
        : policy.notificationMode,
      starterButtonLabel: nextStarter || policy.starterButtonLabel,
    };
  });

  await updateDemoWorkspace(session, (current) => ({
    ...current,
    settings: {
      ...current.settings,
      policies: nextPolicies,
      starterButtons: starterButtonsFromPolicies(nextPolicies),
    },
  }));

  revalidateWorkspacePaths(workspace.settings.publicSlug);
}

export async function createKnowledgeSourceAction(formData: FormData) {
  const session = await requireSession();
  const sourceType = getValue(formData, "sourceType");
  const status = getValue(formData, "status");
  const tags = getValue(formData, "tags")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const workspace = await updateDemoWorkspace(session, (current) => ({
    ...current,
    knowledgeSources: [
      {
        id: `ks-${Date.now()}`,
        sellerId: current.settings.sellerId,
        type: knowledgeSourceTypeValues.includes(
          sourceType as (typeof knowledgeSourceTypeValues)[number],
        )
          ? (sourceType as (typeof knowledgeSourceTypeValues)[number])
          : "faq",
        status: knowledgeSourceStatusValues.includes(
          status as (typeof knowledgeSourceStatusValues)[number],
        )
          ? (status as (typeof knowledgeSourceStatusValues)[number])
          : "draft",
        title: getValue(formData, "title") || "無題の根拠情報",
        body: getValue(formData, "body") || "本文未入力",
        tags,
        sellerTypes: [current.settings.sellerType],
        sortOrder: current.knowledgeSources.length,
      },
      ...current.knowledgeSources,
    ],
  }));

  revalidateWorkspacePaths(workspace.settings.publicSlug);
}

export async function updateKnowledgeSourceStatusAction(formData: FormData) {
  const session = await requireSession();
  const sourceId = getValue(formData, "sourceId");
  const nextStatus = getValue(formData, "status");
  const workspace = await updateDemoWorkspace(session, (current) => ({
    ...current,
    knowledgeSources: current.knowledgeSources.map((source) =>
      source.id === sourceId && knowledgeSourceStatusValues.includes(
        nextStatus as (typeof knowledgeSourceStatusValues)[number],
      )
        ? {
            ...source,
            status: nextStatus as (typeof knowledgeSourceStatusValues)[number],
          }
        : source,
    ),
  }));

  revalidateWorkspacePaths(workspace.settings.publicSlug);
}

export async function saveNotificationSettingsAction(formData: FormData) {
  const session = await requireSession();
  const workspace = await updateDemoWorkspace(session, (current) => ({
    ...current,
    settings: {
      ...current.settings,
      notificationEmail:
        getValue(formData, "notificationEmail") || current.settings.notificationEmail,
    },
  }));

  revalidateWorkspacePaths(workspace.settings.publicSlug);
}

export async function savePublishSettingsAction(formData: FormData) {
  const session = await requireSession();
  const nextStatus = getValue(formData, "publicStatus");
  const manualButtons = getValue(formData, "starterButtons")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const workspace = await updateDemoWorkspace(session, (current) => ({
    ...current,
    settings: {
      ...current.settings,
      publicSlug: sanitizeSlug(getValue(formData, "publicSlug") || current.settings.publicSlug),
      publicStatus: publicStatusValues.includes(
        nextStatus as (typeof publicStatusValues)[number],
      )
        ? (nextStatus as (typeof publicStatusValues)[number])
        : current.settings.publicStatus,
      publicIntroMessage:
        getValue(formData, "publicIntroMessage") || current.settings.publicIntroMessage,
      scopeMessage: getValue(formData, "scopeMessage") || current.settings.scopeMessage,
      starterButtons:
        manualButtons.length > 0
          ? unique(manualButtons)
          : starterButtonsFromPolicies(current.settings.policies),
      setupCompleted: true,
    },
  }));

  revalidateWorkspacePaths(workspace.settings.publicSlug);
}
