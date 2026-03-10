import { intakeCategories } from "@ichijiuke/domain";

export type InquiryPreview = {
  message: string;
  categoryCode: string;
  categoryLabel: string;
  urgency: "normal" | "summary" | "urgent";
  actionLabel: string;
  suggestedReply: string;
};

const keywordRoutes = [
  {
    categoryCode: "C14",
    urgency: "urgent" as const,
    actionLabel: "即時通知",
    keywords: ["返金", "決済", "カード", "個人情報", "法的", "安全"],
    suggestedReply: "高リスク案件として受け付けました。販売者へ優先共有します。",
  },
  {
    categoryCode: "C09",
    urgency: "summary" as const,
    actionLabel: "要約通知",
    keywords: ["未着", "届か", "破損", "壊れ", "不良", "誤配送"],
    suggestedReply: "内容を整理して販売者に共有します。確認に必要な情報も続けて受け付けます。",
  },
  {
    categoryCode: "C03",
    urgency: "normal" as const,
    actionLabel: "規約案内",
    keywords: ["返品", "交換", "キャンセル", "支払い"],
    suggestedReply: "まずは登録済みの規約に沿ってご案内します。必要に応じて販売者確認へ切り替えます。",
  },
];

const fallback = {
  categoryCode: "C07",
  urgency: "summary" as const,
  actionLabel: "販売者確認",
  suggestedReply: "個別判断が必要なため、内容を整理して販売者へ引き継ぎます。",
};

export function simulateInquiry(message: string): InquiryPreview {
  const normalized = message.toLowerCase();
  const matchedRoute = keywordRoutes.find((route) =>
    route.keywords.some((keyword) => normalized.includes(keyword)),
  );
  const resolved = matchedRoute ?? fallback;
  const category =
    intakeCategories.find((item) => item.code === resolved.categoryCode) ??
    intakeCategories[intakeCategories.length - 1];

  return {
    message,
    categoryCode: category.code,
    categoryLabel: category.label,
    urgency: resolved.urgency,
    actionLabel: resolved.actionLabel,
    suggestedReply: resolved.suggestedReply,
  };
}

export const inboxPreview = [
  simulateInquiry("返品したいのですが、条件を教えてください"),
  simulateInquiry("荷物がまだ届いていません"),
  simulateInquiry("決済エラーが出ています"),
];
