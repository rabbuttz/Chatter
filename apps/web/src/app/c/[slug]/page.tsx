import { publicChatStarterButtons } from "@ichijiuke/domain";
import { simulateInquiry } from "@ichijiuke/inquiry-engine";
import { SectionCard, StatusBadge } from "@ichijiuke/ui";

const demoMessages = [
  "返品したいのですが条件を教えてください",
  "商品が届いていません",
  "決済が二重に見えます",
];

export default async function PublicChatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const previews = demoMessages.map((message) => simulateInquiry(message));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-10 lg:px-10">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          eyebrow="Public Chat"
          title={`/${slug}`}
          description="購入者向け一次受けの公開面です。自由回答ではなく、カテゴリ選別と根拠ベース応答を前提にしています。"
        >
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="accent">発送・返品ルールの案内</StatusBadge>
            <StatusBadge tone="accent">商品情報の確認</StatusBadge>
            <StatusBadge tone="warning">高リスクは優先通知</StatusBadge>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {publicChatStarterButtons.map((label) => (
              <button
                key={label}
                type="button"
                className="rounded-full border border-line bg-surface-strong px-4 py-2 text-sm font-semibold"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4 text-sm leading-7 text-muted">
            この窓口では、発送・返品ルール・商品情報をご案内できます。不良品や決済トラブルは内容を整理して販売者へ共有します。
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Preview"
          title="一次受けプレビュー"
          description="将来は入力フォームへ置き換えますが、いまは engine package の判定結果を見える化しています。"
        >
          <div className="space-y-4">
            {previews.map((item) => (
              <div key={item.message} className="rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4">
                <p className="text-sm text-muted">user</p>
                <p className="mt-2 text-sm">{item.message}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge tone={item.urgency === "urgent" ? "warning" : item.urgency === "summary" ? "accent" : "neutral"}>
                    {item.categoryLabel}
                  </StatusBadge>
                  <StatusBadge tone="neutral">{item.actionLabel}</StatusBadge>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted">{item.suggestedReply}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </main>
  );
}
