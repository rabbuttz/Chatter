import { z } from "zod";

export const sellerTypeValues = ["physical", "digital", "hybrid"] as const;
export const handlingModeValues = [
  "auto_answer",
  "policy_redirect",
  "handoff",
  "urgent_handoff",
  "reject",
  "log_only",
] as const;
export const notificationModeValues = ["none", "summary", "urgent"] as const;
export const categoryGroupValues = [
  "faq",
  "policy",
  "scope",
  "incident",
  "risk",
] as const;
export const knowledgeSourceTypeValues = [
  "faq",
  "policy",
  "product",
  "business",
] as const;
export const knowledgeSourceStatusValues = [
  "draft",
  "published",
  "archived",
] as const;
export const publicStatusValues = [
  "draft",
  "private_preview",
  "published",
] as const;
export const inquiryStatusValues = [
  "open",
  "auto_closed",
  "handoff_required",
  "urgent_review",
  "resolved",
] as const;
export const autoReplyToneValues = ["neutral", "warm", "firm"] as const;
export const alertModeValues = ["summary", "urgent"] as const;

export const sellerTypeSchema = z.enum(sellerTypeValues);
export const handlingModeSchema = z.enum(handlingModeValues);
export const notificationModeSchema = z.enum(notificationModeValues);
export const categoryGroupSchema = z.enum(categoryGroupValues);
export const knowledgeSourceTypeSchema = z.enum(knowledgeSourceTypeValues);
export const knowledgeSourceStatusSchema = z.enum(knowledgeSourceStatusValues);
export const publicStatusSchema = z.enum(publicStatusValues);
export const inquiryStatusSchema = z.enum(inquiryStatusValues);
export const autoReplyToneSchema = z.enum(autoReplyToneValues);
export const alertModeSchema = z.enum(alertModeValues);

export type SellerType = z.infer<typeof sellerTypeSchema>;
export type HandlingMode = z.infer<typeof handlingModeSchema>;
export type NotificationMode = z.infer<typeof notificationModeSchema>;
export type CategoryGroup = z.infer<typeof categoryGroupSchema>;
export type KnowledgeSourceType = z.infer<typeof knowledgeSourceTypeSchema>;
export type KnowledgeSourceStatus = z.infer<typeof knowledgeSourceStatusSchema>;
export type PublicStatus = z.infer<typeof publicStatusSchema>;
export type InquiryStatus = z.infer<typeof inquiryStatusSchema>;
export type AutoReplyTone = z.infer<typeof autoReplyToneSchema>;
export type AlertMode = z.infer<typeof alertModeSchema>;

export const sellerTypeOptionSchema = z.object({
  value: sellerTypeSchema,
  label: z.string().min(1),
  description: z.string().min(1),
  focusAreas: z.array(z.string()).min(1),
});

export const sellerTypes = [
  {
    value: "physical",
    label: "物販販売者",
    description: "発送、返品、送料、サイズ、素材などの案内を中心にしたフロー。",
    focusAreas: ["発送", "返品", "配送トラブル", "商品仕様"],
  },
  {
    value: "digital",
    label: "デジタル商品販売者",
    description: "DL案内、ライセンス、再配布不可、Booth 補助を含むフロー。",
    focusAreas: ["DL案内", "ライセンス", "再配布不可", "販売チャネル"],
  },
  {
    value: "hybrid",
    label: "ハイブリッド運用",
    description: "物販とデジタルの差分を同一ショップ内で切り替える運用。",
    focusAreas: ["sellerType 差分", "複合カテゴリ", "統合通知"],
  },
] as const satisfies ReadonlyArray<z.infer<typeof sellerTypeOptionSchema>>;

export const intakeCategorySchema = z.object({
  code: z.string().min(2),
  label: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  group: categoryGroupSchema,
  sellerTypes: z.array(sellerTypeSchema).min(1),
  defaultHandling: handlingModeSchema,
  notificationMode: notificationModeSchema,
  isHighRisk: z.boolean(),
  starterButtonLabel: z.string().min(1).optional(),
  suggestedSources: z.array(knowledgeSourceTypeSchema).min(1),
});

export type IntakeCategory = z.infer<typeof intakeCategorySchema>;

export const intakeCategories: IntakeCategory[] = [
  {
    code: "C01",
    label: "発送・お届け",
    summary: "発送時期、送料、配送方法、営業日などの問い合わせ。",
    description: "配送予定、追跡、送料、発送タイミングを FAQ 中心で回答する。",
    group: "faq",
    sellerTypes: ["physical", "hybrid"],
    defaultHandling: "auto_answer",
    notificationMode: "none",
    isHighRisk: false,
    starterButtonLabel: "発送・お届けについて",
    suggestedSources: ["faq", "business"],
  },
  {
    code: "C02",
    label: "商品情報",
    summary: "サイズ、素材、仕様、利用条件などの商品説明。",
    description: "商品ページに近い情報を根拠として回答する。",
    group: "faq",
    sellerTypes: ["physical", "digital", "hybrid"],
    defaultHandling: "auto_answer",
    notificationMode: "none",
    isHighRisk: false,
    starterButtonLabel: "商品について",
    suggestedSources: ["faq", "product"],
  },
  {
    code: "C03",
    label: "返品・キャンセル規約",
    summary: "返品、交換、キャンセル、支払いルールなど規約案内で閉じる問い合わせ。",
    description: "規約の案内で完結できる問い合わせを閉じる。",
    group: "policy",
    sellerTypes: ["physical", "digital", "hybrid"],
    defaultHandling: "policy_redirect",
    notificationMode: "none",
    isHighRisk: false,
    starterButtonLabel: "返品・交換について",
    suggestedSources: ["policy", "business"],
  },
  {
    code: "C04",
    label: "利用条件・ライセンス",
    summary: "デジタル商品の利用条件、再配布不可、支払い条件の確認。",
    description: "利用規約やライセンス条件に基づいて説明する。",
    group: "policy",
    sellerTypes: ["digital", "hybrid"],
    defaultHandling: "policy_redirect",
    notificationMode: "none",
    isHighRisk: false,
    suggestedSources: ["policy", "product"],
  },
  {
    code: "C05",
    label: "対応範囲外",
    summary: "値下げ交渉、特例依頼、ルール外の相談など窓口外の依頼。",
    description: "明示的に受け付けない内容を案内して終了する。",
    group: "scope",
    sellerTypes: ["physical", "digital", "hybrid"],
    defaultHandling: "reject",
    notificationMode: "none",
    isHighRisk: false,
    suggestedSources: ["policy"],
  },
  {
    code: "C06",
    label: "販売者確認が必要",
    summary: "FAQ や規約だけでは閉じない個別相談。",
    description: "販売者へ確認が必要な内容を要約して引き継ぐ。",
    group: "scope",
    sellerTypes: ["physical", "digital", "hybrid"],
    defaultHandling: "handoff",
    notificationMode: "summary",
    isHighRisk: false,
    suggestedSources: ["faq", "policy"],
  },
  {
    code: "C07",
    label: "オーダー・例外相談",
    summary: "オーダー相談や例外対応など販売者判断に送るべき内容。",
    description: "大口注文や個別制作の相談を要約して販売者へ送る。",
    group: "scope",
    sellerTypes: ["physical", "digital", "hybrid"],
    defaultHandling: "handoff",
    notificationMode: "summary",
    isHighRisk: false,
    starterButtonLabel: "オーダー相談",
    suggestedSources: ["business", "product"],
  },
  {
    code: "C08",
    label: "未着・誤配送",
    summary: "発送済み商品の未着や配送間違い。",
    description: "配送トラブルを販売者確認へ引き継ぐ。",
    group: "incident",
    sellerTypes: ["physical", "hybrid"],
    defaultHandling: "handoff",
    notificationMode: "summary",
    isHighRisk: false,
    starterButtonLabel: "注文トラブルについて",
    suggestedSources: ["business", "product"],
  },
  {
    code: "C09",
    label: "不良品・破損",
    summary: "不良品、誤配送、未着、説明との差異など事故性のある問い合わせ。",
    description: "不良や破損などの事故系は販売者へ要約通知する。",
    group: "incident",
    sellerTypes: ["physical", "hybrid"],
    defaultHandling: "handoff",
    notificationMode: "summary",
    isHighRisk: false,
    suggestedSources: ["policy", "product"],
  },
  {
    code: "C10",
    label: "説明相違・通常クレーム",
    summary: "商品説明との差異や通常の苦情。",
    description: "法務・安全まで行かない苦情を販売者確認へ送る。",
    group: "incident",
    sellerTypes: ["physical", "digital", "hybrid"],
    defaultHandling: "handoff",
    notificationMode: "summary",
    isHighRisk: false,
    suggestedSources: ["product", "policy"],
  },
  {
    code: "C11",
    label: "スパム・荒らし",
    summary: "営業、連投、荒らしなどノイズ性の高い問い合わせ。",
    description: "記録のみで閉じるスパム系。",
    group: "risk",
    sellerTypes: ["physical", "digital", "hybrid"],
    defaultHandling: "log_only",
    notificationMode: "none",
    isHighRisk: false,
    suggestedSources: ["business"],
  },
  {
    code: "C12",
    label: "暴言・不適切表現",
    summary: "不適切な表現を含むが高リスクではない問い合わせ。",
    description: "通常は応答範囲外として閉じる。",
    group: "risk",
    sellerTypes: ["physical", "digital", "hybrid"],
    defaultHandling: "reject",
    notificationMode: "none",
    isHighRisk: false,
    suggestedSources: ["policy"],
  },
  {
    code: "C13",
    label: "決済・個人情報問題",
    summary: "決済トラブルや個人情報に関する問題。",
    description: "優先通知が必要な高リスクカテゴリ。",
    group: "risk",
    sellerTypes: ["physical", "digital", "hybrid"],
    defaultHandling: "urgent_handoff",
    notificationMode: "urgent",
    isHighRisk: true,
    suggestedSources: ["policy", "business"],
  },
  {
    code: "C14",
    label: "法務・安全性",
    summary: "法的示唆や安全性など優先通知が必要な内容。",
    description: "最優先で販売者へ通知し、AI で閉じない。",
    group: "risk",
    sellerTypes: ["physical", "digital", "hybrid"],
    defaultHandling: "urgent_handoff",
    notificationMode: "urgent",
    isHighRisk: true,
    suggestedSources: ["policy", "business"],
  },
  {
    code: "C15",
    label: "判定保留",
    summary: "情報不足で即断できない問い合わせ。",
    description: "不足情報の確認または販売者確認へ送るための保留カテゴリ。",
    group: "scope",
    sellerTypes: ["physical", "digital", "hybrid"],
    defaultHandling: "handoff",
    notificationMode: "summary",
    isHighRisk: false,
    suggestedSources: ["faq", "policy", "product"],
  },
] as const;

export const sellerPolicySchema = z.object({
  categoryCode: z.string().min(2),
  isEnabled: z.boolean(),
  handlingMode: handlingModeSchema,
  notificationMode: notificationModeSchema,
  starterButtonLabel: z.string().min(1).optional(),
  displayOrder: z.number().int().nonnegative(),
});

export type SellerPolicy = z.infer<typeof sellerPolicySchema>;

export const knowledgeSourceSchema = z.object({
  id: z.string().min(1),
  sellerId: z.string().min(1),
  type: knowledgeSourceTypeSchema,
  status: knowledgeSourceStatusSchema,
  title: z.string().min(1),
  body: z.string().min(1),
  tags: z.array(z.string()).default([]),
  sellerTypes: z.array(sellerTypeSchema).default([...sellerTypeValues]),
  sortOrder: z.number().int().nonnegative().default(0),
});

export type KnowledgeSource = z.infer<typeof knowledgeSourceSchema>;

export const notificationSummarySchema = z.object({
  id: z.string().min(1),
  sellerId: z.string().min(1),
  inquiryId: z.string().min(1),
  categoryCode: z.string().min(2),
  urgency: alertModeSchema,
  headline: z.string().min(1),
  summary: z.string().min(1),
  suggestedAction: z.string().min(1),
  userMessagePreview: z.string().min(1),
});

export type NotificationSummary = z.infer<typeof notificationSummarySchema>;

export const inquiryRecordSchema = z.object({
  id: z.string().min(1),
  sellerId: z.string().min(1),
  publicSlug: z.string().min(1),
  status: inquiryStatusSchema,
  categoryCode: z.string().min(2),
  handlingMode: handlingModeSchema,
  notificationMode: notificationModeSchema,
  rawMessage: z.string().min(1),
  responsePreview: z.string().optional(),
  summary: z.string().optional(),
});

export type InquiryRecord = z.infer<typeof inquiryRecordSchema>;

export const shopSettingsSchema = z.object({
  sellerId: z.string().min(1),
  shopName: z.string().min(1),
  sellerType: sellerTypeSchema,
  publicSlug: z.string().min(3),
  publicStatus: publicStatusSchema,
  autoReplyTone: autoReplyToneSchema,
  scopeMessage: z.string().min(1),
  publicIntroMessage: z.string().min(1),
  starterButtons: z.array(z.string()).default([]),
  notificationEmail: z.string().email().optional(),
  policies: z.array(sellerPolicySchema).min(1),
  setupCompleted: z.boolean(),
});

export type ShopSettings = z.infer<typeof shopSettingsSchema>;

export const setupSteps = [
  "ショップタイプ選択",
  "受付内容選択",
  "FAQ / 規約登録",
  "通知設定",
  "公開",
] as const;

export const publicChatStarterButtons = intakeCategories.flatMap((category) =>
  category.starterButtonLabel ? [category.starterButtonLabel] : [],
);

export const adminRoutes = [
  {
    href: "/dashboard",
    label: "ダッシュボード",
    summary: "公開状況と直近の一次受け状況を俯瞰する。",
  },
  {
    href: "/setup",
    label: "初期セットアップ",
    summary: "販売者が3〜5分で公開まで進む最短導線。",
  },
  {
    href: "/settings/intake",
    label: "受付内容",
    summary: "カテゴリごとの処理方針と受付範囲を決める。",
  },
  {
    href: "/settings/knowledge",
    label: "FAQ / 規約",
    summary: "FAQ、規約、商品情報を回答根拠として管理する。",
  },
  {
    href: "/settings/notifications",
    label: "通知設定",
    summary: "販売者への通知対象と粒度を制御する。",
  },
  {
    href: "/settings/publish",
    label: "公開設定",
    summary: "公開 URL と開始導線、受付範囲表示を管理する。",
  },
  {
    href: "/inbox",
    label: "受信箱",
    summary: "要約通知、履歴、引き継ぎ一覧を確認する。",
  },
] as const;

export const workspacePackages = [
  "@ichijiuke/domain",
  "@ichijiuke/ui",
  "@ichijiuke/inquiry-engine",
  "@ichijiuke/db",
] as const;

export const intakeCategoryByCode = Object.fromEntries(
  intakeCategories.map((category) => [category.code, category]),
) as Record<string, IntakeCategory>;

export function getCategoriesForSellerType(sellerType: SellerType) {
  return intakeCategories.filter((category) =>
    category.sellerTypes.includes(sellerType),
  );
}

export function createDefaultSellerPolicies(
  sellerType: SellerType,
): SellerPolicy[] {
  return getCategoriesForSellerType(sellerType).map((category, index) => ({
    categoryCode: category.code,
    isEnabled: true,
    handlingMode: category.defaultHandling,
    notificationMode: category.notificationMode,
    starterButtonLabel: category.starterButtonLabel,
    displayOrder: index,
  }));
}
