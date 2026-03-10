"use server";

import { revalidatePath } from "next/cache";

import { evaluateInquiry } from "@ichijiuke/inquiry-engine";

import { getDemoSession } from "@/lib/auth";
import { getDemoWorkspace, updateDemoWorkspace } from "@/lib/demo-workspace";

function getValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export async function submitPublicInquiryAction(formData: FormData) {
  const session = await getDemoSession();
  const slug = getValue(formData, "slug");
  const message = getValue(formData, "message");

  if (!session || !slug || !message) {
    return;
  }

  const workspace = await getDemoWorkspace(session);

  if (workspace.settings.publicSlug !== slug) {
    return;
  }

  const result = evaluateInquiry({
    message,
    sellerType: workspace.settings.sellerType,
    policies: workspace.settings.policies,
    knowledgeSources: workspace.knowledgeSources,
    tone: workspace.settings.autoReplyTone,
  });
  const inquiryId = `inq-${Date.now()}`;
  const createdAt = new Date().toISOString();

  await updateDemoWorkspace(session, (current) => ({
    ...current,
    inquiries: [
      {
        id: inquiryId,
        sellerId: current.settings.sellerId,
        publicSlug: current.settings.publicSlug,
        status: result.inquiryStatus,
        categoryCode: result.categoryCode,
        handlingMode: result.handlingMode,
        notificationMode: result.notificationMode,
        rawMessage: message,
        responsePreview: result.reply,
        summary: result.summary,
        matchedSourceIds: result.matchedSourceIds,
        matchedSourceTitles: result.matchedSourceTitles,
        createdAt,
      },
      ...current.inquiries,
    ].slice(0, 30),
    notifications:
      result.notificationMode === "none"
        ? current.notifications
        : [
            {
              id: `ntf-${Date.now()}`,
              sellerId: current.settings.sellerId,
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
            ...current.notifications,
          ].slice(0, 15),
  }));

  revalidatePath("/dashboard");
  revalidatePath("/inbox");
  revalidatePath(`/c/${slug}`);
}
