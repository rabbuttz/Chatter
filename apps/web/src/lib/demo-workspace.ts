import { cookies } from "next/headers";
import { z } from "zod";

import {
  createDefaultSellerPolicies,
  knowledgeSourceSchema,
  knowledgeSourceTypeValues,
  notificationSummarySchema,
  publicChatStarterButtons,
  shopSettingsSchema,
  type KnowledgeSource,
  type SellerPolicy,
  type ShopSettings,
  type NotificationSummary,
  inquiryRecordSchema,
  type InquiryRecord,
} from "@ichijiuke/domain";

import type { DemoSession } from "@/lib/auth";

const DEMO_WORKSPACE_COOKIE = "ichijiuke_demo_workspace";

const demoWorkspaceSchema = z.object({
  settings: shopSettingsSchema,
  knowledgeSources: z.array(knowledgeSourceSchema),
  inquiries: z.array(inquiryRecordSchema),
  notifications: z.array(notificationSummarySchema),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export type DemoWorkspace = z.infer<typeof demoWorkspaceSchema>;

function encodeWorkspace(workspace: DemoWorkspace) {
  return Buffer.from(JSON.stringify(workspace), "utf8").toString("base64url");
}

function decodeWorkspace(value: string) {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));

    return demoWorkspaceSchema.parse(parsed);
  } catch {
    return null;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function slugify(value: string) {
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

function sellerIdFromSession(session: DemoSession) {
  return slugify(session.email.replace("@", "-"));
}

function starterButtonsFromPolicies(policies: SellerPolicy[]) {
  return unique(
    policies
      .filter((policy) => policy.isEnabled && policy.starterButtonLabel)
      .map((policy) => policy.starterButtonLabel as string),
  ).slice(0, 6);
}

function buildKnowledgeSources(
  sellerId: string,
  sellerType: ShopSettings["sellerType"],
): KnowledgeSource[] {
  return [
    {
      id: `${sellerId}-faq-shipping`,
      sellerId,
      type: "faq",
      status: "published",
      title: "発送目安",
      body:
        sellerType === "digital"
          ? "購入後すぐにダウンロード案内を表示します。Booth / BASE の案内に沿って再取得できます。"
          : "通常は3営業日以内に発送します。発送完了後に追跡番号を共有します。",
      tags: sellerType === "digital" ? ["ダウンロード", "購入後", "再取得"] : ["発送", "配送", "営業日"],
      sellerTypes: [sellerType],
      sortOrder: 0,
    },
    {
      id: `${sellerId}-policy-main`,
      sellerId,
      type: "policy",
      status: "published",
      title: sellerType === "digital" ? "利用規約と返金ポリシー" : "返品・キャンセル規約",
      body:
        sellerType === "digital"
          ? "デジタル商品の再配布は禁止です。返金可否と商用利用範囲は商品ページの規約に従います。"
          : "不良品を除き購入者都合の返品・キャンセルは受け付けません。交換条件は商品ページの案内に従います。",
      tags:
        sellerType === "digital"
          ? ["利用規約", "商用利用", "再配布", "返金"]
          : ["返品", "キャンセル", "交換", "支払い"],
      sellerTypes: [sellerType],
      sortOrder: 1,
    },
    {
      id: `${sellerId}-product-main`,
      sellerId,
      type: "product",
      status: "published",
      title: sellerType === "digital" ? "商品仕様と対応環境" : "商品情報",
      body:
        sellerType === "digital"
          ? "対応環境、ファイル形式、インポート手順、アップデート方針をここで案内します。"
          : "サイズ、素材、色味、発送方法など商品ページの要点をまとめています。",
      tags:
        sellerType === "digital"
          ? ["対応環境", "ファイル形式", "使い方", "アップデート"]
          : ["サイズ", "素材", "色味", "仕様"],
      sellerTypes: [sellerType],
      sortOrder: 2,
    },
    {
      id: `${sellerId}-business-scope`,
      sellerId,
      type: "business",
      status: "published",
      title: "窓口の対応範囲",
      body:
        "発送や商品説明、規約案内はこの窓口で対応します。個別交渉や法的判断が必要な内容は販売者確認へ切り替えます。",
      tags: ["対応範囲", "発送", "商品情報", "規約"],
      sellerTypes: [sellerType],
      sortOrder: 3,
    },
  ];
}

function buildSeedInquiries(
  sellerId: string,
  publicSlug: string,
): InquiryRecord[] {
  return [
    {
      id: `${sellerId}-inq-01`,
      sellerId,
      publicSlug,
      status: "auto_closed",
      categoryCode: "C03",
      handlingMode: "policy_redirect",
      notificationMode: "none",
      rawMessage: "返品したいのですが条件を教えてください。",
      responsePreview: "返品・キャンセル規約をもとにご案内します。",
      summary: "返品条件の確認。規約案内で完結可能。",
      matchedSourceIds: [`${sellerId}-policy-main`],
      matchedSourceTitles: ["返品・キャンセル規約"],
      createdAt: nowIso(),
    },
    {
      id: `${sellerId}-inq-02`,
      sellerId,
      publicSlug,
      status: "handoff_required",
      categoryCode: "C08",
      handlingMode: "handoff",
      notificationMode: "summary",
      rawMessage: "発送通知は来ましたが、荷物がまだ届いていません。",
      responsePreview: "配送トラブルとして販売者へ引き継ぎます。",
      summary: "未着相談。配送状況確認が必要。",
      matchedSourceIds: [`${sellerId}-faq-shipping`],
      matchedSourceTitles: ["発送目安"],
      createdAt: nowIso(),
    },
    {
      id: `${sellerId}-inq-03`,
      sellerId,
      publicSlug,
      status: "urgent_review",
      categoryCode: "C13",
      handlingMode: "urgent_handoff",
      notificationMode: "urgent",
      rawMessage: "決済が二重に見えるので確認してほしいです。",
      responsePreview: "高リスクとして優先共有します。",
      summary: "決済関連。優先確認が必要。",
      matchedSourceIds: [`${sellerId}-policy-main`],
      matchedSourceTitles: ["利用規約と返金ポリシー"],
      createdAt: nowIso(),
    },
  ];
}

function buildSeedNotifications(
  sellerId: string,
  inquiries: InquiryRecord[],
): NotificationSummary[] {
  return inquiries
    .filter((inquiry) => inquiry.notificationMode !== "none")
    .map((inquiry, index) => ({
      id: `${sellerId}-ntf-${index + 1}`,
      sellerId,
      inquiryId: inquiry.id,
      categoryCode: inquiry.categoryCode,
      urgency: inquiry.notificationMode === "urgent" ? "urgent" : "summary",
      headline:
        inquiry.notificationMode === "urgent"
          ? "即時確認が必要な問い合わせ"
          : "販売者確認が必要な問い合わせ",
      summary: inquiry.summary ?? inquiry.rawMessage,
      suggestedAction:
        inquiry.notificationMode === "urgent"
          ? "決済・個人情報系として優先確認"
          : "配送状況や対応方針を確認して返信",
      userMessagePreview: inquiry.rawMessage.slice(0, 80),
      referenceTitles: inquiry.matchedSourceTitles,
      createdAt: nowIso(),
    }));
}

function buildWorkspace(
  session: DemoSession,
  options?: {
    slug?: string;
    status?: ShopSettings["publicStatus"];
    setupCompleted?: boolean;
  },
): DemoWorkspace {
  const sellerId = sellerIdFromSession(session);
  const publicSlug = options?.slug ?? slugify(session.displayName || session.email);
  const policies = createDefaultSellerPolicies(session.sellerType);
  const createdAt = nowIso();
  const settings: ShopSettings = {
    sellerId,
    shopName: `${session.displayName} shop`,
    sellerType: session.sellerType,
    publicSlug,
    publicStatus: options?.status ?? "private_preview",
    autoReplyTone: "warm",
    scopeMessage:
      "発送・返品ルール・商品情報はご案内できます。個別交渉や法的判断は販売者確認へ切り替えます。",
    publicIntroMessage:
      "ご質問ありがとうございます。FAQ と規約をもとに一次受けし、必要な内容だけ販売者へ引き継ぎます。",
    starterButtons:
      starterButtonsFromPolicies(policies).length > 0
        ? starterButtonsFromPolicies(policies)
        : publicChatStarterButtons.slice(0, 5),
    notificationEmail: session.email,
    policies,
    setupCompleted: options?.setupCompleted ?? false,
  };
  const knowledgeSources = buildKnowledgeSources(sellerId, session.sellerType);
  const inquiries = buildSeedInquiries(sellerId, publicSlug);
  const notifications = buildSeedNotifications(sellerId, inquiries);

  return {
    settings,
    knowledgeSources,
    inquiries,
    notifications,
    createdAt,
    updatedAt: createdAt,
  };
}

function buildPublishedDemoWorkspace() {
  return buildWorkspace(
    {
      createdAt: nowIso(),
      displayName: "Demo Shop",
      email: "demo-shop@example.com",
      sellerType: "hybrid",
    },
    {
      slug: "demo-shop",
      status: "published",
      setupCompleted: true,
    },
  );
}

function reconcileWorkspace(
  session: DemoSession,
  workspace: DemoWorkspace,
) {
  const sellerId = sellerIdFromSession(session);
  const nextPolicies =
    workspace.settings.policies.length > 0
      ? workspace.settings.policies
      : createDefaultSellerPolicies(workspace.settings.sellerType);

  return demoWorkspaceSchema.parse({
    ...workspace,
    settings: {
      ...workspace.settings,
      sellerId,
      notificationEmail: workspace.settings.notificationEmail || session.email,
      policies: nextPolicies,
      starterButtons:
        workspace.settings.starterButtons.length > 0
          ? workspace.settings.starterButtons
          : starterButtonsFromPolicies(nextPolicies),
    },
  });
}

export async function getDemoWorkspace(
  session: DemoSession,
): Promise<DemoWorkspace> {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(DEMO_WORKSPACE_COOKIE)?.value;
  const stored = rawValue ? decodeWorkspace(rawValue) : null;

  if (!stored) {
    return buildWorkspace(session);
  }

  return reconcileWorkspace(session, stored);
}

export async function getPublicDemoWorkspace(
  slug: string,
  session?: DemoSession | null,
): Promise<DemoWorkspace | null> {
  if (session) {
    const workspace = await getDemoWorkspace(session);

    if (workspace.settings.publicSlug === slug) {
      return workspace;
    }
  }

  if (slug === "demo-shop") {
    return buildPublishedDemoWorkspace();
  }

  return null;
}

export async function saveDemoWorkspace(
  session: DemoSession,
  workspace: DemoWorkspace,
) {
  const cookieStore = await cookies();
  const normalized = reconcileWorkspace(session, {
    ...workspace,
    updatedAt: nowIso(),
  });

  cookieStore.set(DEMO_WORKSPACE_COOKIE, encodeWorkspace(normalized), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function updateDemoWorkspace(
  session: DemoSession,
  updater: (workspace: DemoWorkspace) => DemoWorkspace,
) {
  const workspace = await getDemoWorkspace(session);
  const nextWorkspace = updater(workspace);

  await saveDemoWorkspace(session, {
    ...nextWorkspace,
    updatedAt: nowIso(),
  });

  return getDemoWorkspace(session);
}

export function getWorkspaceMetrics(workspace: DemoWorkspace) {
  const totalInquiries = workspace.inquiries.length;
  const autoClosedCount = workspace.inquiries.filter(
    (inquiry) => inquiry.status === "auto_closed",
  ).length;
  const handoffCount = workspace.inquiries.filter(
    (inquiry) => inquiry.status === "handoff_required",
  ).length;
  const urgentCount = workspace.notifications.filter(
    (notification) => notification.urgency === "urgent",
  ).length;
  const notificationCount = workspace.notifications.length;
  const completionScore = [
    workspace.settings.shopName.trim().length > 0,
    workspace.settings.scopeMessage.trim().length > 0,
    workspace.settings.publicIntroMessage.trim().length > 0,
    workspace.knowledgeSources.filter((source) => source.status === "published").length >= 3,
    workspace.settings.publicStatus !== "draft" || workspace.settings.setupCompleted,
  ].filter(Boolean).length;

  return {
    totalInquiries,
    autoClosedCount,
    handoffCount,
    urgentCount,
    notificationCount,
    completionPercent: Math.round((completionScore / 5) * 100),
    published: workspace.settings.publicStatus === "published",
  };
}

export function getEnabledPolicies(workspace: DemoWorkspace) {
  return [...workspace.settings.policies]
    .filter((policy) => policy.isEnabled)
    .sort((left, right) => left.displayOrder - right.displayOrder);
}

export function getKnowledgeSourcesByType(workspace: DemoWorkspace) {
  return Object.fromEntries(
    knowledgeSourceTypeValues.map((type) => [
      type,
      workspace.knowledgeSources.filter((source) => source.type === type),
    ]),
  ) as Record<(typeof knowledgeSourceTypeValues)[number], KnowledgeSource[]>;
}
