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

export const sellerTypeSchema = z.enum(sellerTypeValues);
export const handlingModeSchema = z.enum(handlingModeValues);
export const notificationModeSchema = z.enum(notificationModeValues);

export type SellerType = z.infer<typeof sellerTypeSchema>;
export type HandlingMode = z.infer<typeof handlingModeSchema>;
export type NotificationMode = z.infer<typeof notificationModeSchema>;

export type IntakeCategory = {
  code: string;
  label: string;
  summary: string;
  defaultHandling: HandlingMode;
  notificationMode: NotificationMode;
};

export const sellerTypes = [
  {
    value: "physical",
    label: "物販販売者",
    description: "発送、返品、送料、サイズ、素材などの案内を中心にしたフロー。",
  },
  {
    value: "digital",
    label: "デジタル商品販売者",
    description: "DL案内、ライセンス、再配布不可、Booth 補助を含むフロー。",
  },
  {
    value: "hybrid",
    label: "ハイブリッド運用",
    description: "物販とデジタルの差分を同一ショップ内で切り替える運用。",
  },
] as const satisfies ReadonlyArray<{
  value: SellerType;
  label: string;
  description: string;
}>;

export const intakeCategories = [
  {
    code: "C01",
    label: "発送・お届け",
    summary: "発送時期、送料、配送方法、営業日などの問い合わせ。",
    defaultHandling: "auto_answer",
    notificationMode: "none",
  },
  {
    code: "C03",
    label: "返品・キャンセル規約",
    summary: "返品、交換、キャンセル、支払いルールなど規約案内で閉じる問い合わせ。",
    defaultHandling: "policy_redirect",
    notificationMode: "none",
  },
  {
    code: "C05",
    label: "対応範囲外",
    summary: "値下げ交渉、特例依頼、ルール外の相談など窓口外の依頼。",
    defaultHandling: "reject",
    notificationMode: "none",
  },
  {
    code: "C07",
    label: "個別判断が必要",
    summary: "オーダー相談や例外対応など販売者判断に送るべき内容。",
    defaultHandling: "handoff",
    notificationMode: "summary",
  },
  {
    code: "C09",
    label: "不良品・未着・破損",
    summary: "不良品、誤配送、未着、説明との差異など事故性のある問い合わせ。",
    defaultHandling: "handoff",
    notificationMode: "summary",
  },
  {
    code: "C14",
    label: "高リスク",
    summary: "決済、個人情報、法的示唆、安全性など優先通知が必要な内容。",
    defaultHandling: "urgent_handoff",
    notificationMode: "urgent",
  },
] as const satisfies ReadonlyArray<IntakeCategory>;

export const setupSteps = [
  "ショップタイプ選択",
  "受付内容選択",
  "FAQ / 規約登録",
  "通知設定",
  "公開",
] as const;

export const publicChatStarterButtons = [
  "発送・お届けについて",
  "返品・交換について",
  "商品について",
  "注文トラブルについて",
  "オーダー相談",
  "その他",
] as const;

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
