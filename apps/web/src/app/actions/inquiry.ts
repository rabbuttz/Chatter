"use server";

import { revalidatePath } from "next/cache";

import { getDemoSession } from "@/lib/auth";
import {
  getPublicDemoWorkspace,
  persistDemoWorkspace,
  saveDemoWorkspace,
} from "@/lib/demo-workspace";
import { isProductionPersistenceEnabled } from "@/lib/env";
import { evaluateInquiryWithFallback } from "@/lib/inquiry-ai";

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export async function submitPublicInquiryAction(formData: FormData) {
  const session = await getDemoSession();
  const slug = getValue(formData, "slug");
  const message = getValue(formData, "message");

  if (!slug || !message) {
    return;
  }

  const workspace = await getPublicDemoWorkspace(slug, session);

  if (!workspace) {
    return;
  }

  const result = await evaluateInquiryWithFallback({
    message,
    sellerType: workspace.settings.sellerType,
    policies: workspace.settings.policies,
    knowledgeSources: workspace.knowledgeSources,
    tone: workspace.settings.autoReplyTone,
  });
  const inquiryId = `inq-${Date.now()}`;
  const createdAt = new Date().toISOString();
  const nextWorkspace = {
    ...workspace,
    updatedAt: createdAt,
    inquiries: [
      {
        id: inquiryId,
        sellerId: workspace.settings.sellerId,
        publicSlug: workspace.settings.publicSlug,
        status: result.inquiryStatus,
        categoryCode: result.categoryCode,
        handlingMode: result.handlingMode,
        notificationMode: result.notificationMode,
        rawMessage: message,
        responsePreview: result.reply,
        summary: result.summary,
        matchedSourceIds: result.matchedSourceIds,
        matchedSourceTitles: result.matchedSourceTitles,
        responseSource: result.responseSource,
        responseModel: result.responseModel,
        createdAt,
      },
      ...workspace.inquiries,
    ].slice(0, 30),
    notifications:
      result.notificationMode === "none"
        ? workspace.notifications
        : [
            {
              id: `ntf-${Date.now()}`,
              sellerId: workspace.settings.sellerId,
              inquiryId,
              categoryCode: result.categoryCode,
              urgency:
                result.notificationMode === "urgent"
                  ? ("urgent" as const)
                  : ("summary" as const),
              headline: result.headline,
              summary: result.summary,
              suggestedAction: result.suggestedAction,
              userMessagePreview: message.slice(0, 80),
              referenceTitles: result.matchedSourceTitles,
              createdAt,
            },
            ...workspace.notifications,
          ].slice(0, 15),
  };

  if (session?.sellerId === workspace.settings.sellerId) {
    await saveDemoWorkspace(session, nextWorkspace);
  } else if (isProductionPersistenceEnabled()) {
    await persistDemoWorkspace(nextWorkspace);
  } else {
    return;
  }

  revalidatePath("/dashboard");
  revalidatePath("/inbox");
  revalidatePath(`/c/${slug}`);
}
