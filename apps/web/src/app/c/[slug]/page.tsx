import Link from "next/link";

import { intakeCategoryByCode } from "@ichijiuke/domain";
import { SectionCard, StatusBadge } from "@ichijiuke/ui";

import { submitPublicInquiryAction } from "@/app/actions/inquiry";
import { getDemoSession, isDemoFallbackEnabled } from "@/lib/auth";
import { getPublicDemoWorkspace } from "@/lib/demo-workspace";
import { getInquiryResponseMode } from "@/lib/env";

export const dynamic = "force-dynamic";

const inputClassName =
  "rounded-[18px] border border-line bg-surface-strong px-4 py-3 text-sm outline-none";

export default async function PublicChatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getDemoSession();
  const isDemoMode = isDemoFallbackEnabled();
  const inquiryResponseMode = getInquiryResponseMode();
  const workspace = await getPublicDemoWorkspace(slug, session);

  if (!workspace) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-10 lg:px-10">
        <SectionCard
          eyebrow="Public Chat"
          title="not found"
          description={
            isDemoMode
              ? "この公開 URL は見つかりませんでした。seller 側で slug を確認するか、ローカル確認用の demo-shop を使ってください。"
              : "この公開 URL は見つかりませんでした。seller 側で slug を確認して再公開してください。"
          }
        >
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white"
              href="/login"
            >
              admin login
            </Link>
            <Link
              className="rounded-full border border-line px-5 py-3 text-sm font-semibold"
              href={isDemoMode ? "/c/demo-shop" : "/signup"}
            >
              {isDemoMode ? "open demo-shop" : "create seller"}
            </Link>
          </div>
        </SectionCard>
      </main>
    );
  }

  const isOwnerPreview =
    session?.sellerId === workspace.settings.sellerId &&
    slug === workspace.settings.publicSlug;
  const recentInquiries = workspace.inquiries.slice(0, 8);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-10 lg:px-10">
      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <SectionCard
          eyebrow="Public Chat"
          title={`/${slug}`}
          description="購入者向けの一次受け窓口です。FAQ と規約をもとに整理し、必要な内容だけ販売者へ引き継ぎます。"
        >
          <div className="flex flex-wrap gap-2">
            <StatusBadge
              tone={workspace.settings.publicStatus === "published" ? "accent" : "neutral"}
            >
              {workspace.settings.publicStatus}
            </StatusBadge>
            <StatusBadge tone="accent">{workspace.settings.shopName}</StatusBadge>
            <StatusBadge tone={isOwnerPreview ? "warning" : "neutral"}>
              {isOwnerPreview ? "owner preview" : "public intake"}
            </StatusBadge>
            <StatusBadge tone={inquiryResponseMode === "openai" ? "accent" : "neutral"}>
              {inquiryResponseMode === "openai" ? "OpenAI grounded" : "rules fallback"}
            </StatusBadge>
          </div>

          <p className="mt-6 text-sm leading-7 text-muted">
            {workspace.settings.publicIntroMessage}
          </p>

          <div className="mt-6 rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4 text-sm leading-7 text-muted">
            {workspace.settings.scopeMessage}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {workspace.settings.starterButtons.map((label) => (
              <form key={label} action={submitPublicInquiryAction}>
                <input name="slug" type="hidden" value={slug} />
                <input name="message" type="hidden" value={label} />
                <button
                  className="rounded-full border border-line bg-surface-strong px-4 py-2 text-sm font-semibold"
                  type="submit"
                >
                  {label}
                </button>
              </form>
            ))}
          </div>

          <form action={submitPublicInquiryAction} className="mt-6 grid gap-3">
            <input name="slug" type="hidden" value={slug} />
            <label className="grid gap-2 text-sm font-semibold">
              問い合わせ内容
              <textarea
                className={`${inputClassName} min-h-32`}
                name="message"
                placeholder="発送時期、返品ルール、商品仕様、注文トラブルなどを入力してください"
              />
            </label>
            <button
              className="inline-flex w-fit rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white"
              type="submit"
            >
              問い合わせる
            </button>
          </form>

          <p className="mt-4 text-sm leading-7 text-muted">
            {isDemoMode && !isOwnerPreview
              ? "`demo-shop` は静的なローカル確認用デモです。永続保存は seller の owner preview か本番モードで確認してください。"
              : inquiryResponseMode === "openai"
                ? "公開問い合わせは OpenAI と published knowledge を使って一次受けし、分類結果と要約付きで inbox に保存されます。"
                : "公開問い合わせは rules fallback で一次受けし、分類結果と要約付きで inbox に保存されます。"}
          </p>
        </SectionCard>

        <SectionCard
          eyebrow="Conversation"
          title="一次受け履歴"
          description="保存済みの問い合わせから、分類・返信・引き継ぎ方針を確認できます。owner preview でも公開導線でもここに反映されます。"
        >
          <div className="space-y-4">
            {recentInquiries.map((inquiry) => {
              const category = intakeCategoryByCode[inquiry.categoryCode];

              return (
                <div
                  key={inquiry.id}
                  className="rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4"
                >
                  <p className="text-sm text-muted">user</p>
                  <p className="mt-2 text-sm leading-6">{inquiry.rawMessage}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <StatusBadge
                      tone={
                        inquiry.notificationMode === "urgent"
                          ? "warning"
                          : inquiry.notificationMode === "summary"
                            ? "accent"
                            : "neutral"
                      }
                    >
                      {category?.label ?? inquiry.categoryCode}
                    </StatusBadge>
                    <StatusBadge tone="neutral">{inquiry.handlingMode}</StatusBadge>
                    <StatusBadge tone={inquiry.responseSource === "openai" ? "accent" : "neutral"}>
                      {inquiry.responseSource === "openai" ? "openai" : "rules"}
                    </StatusBadge>
                  </div>
                  {inquiry.matchedSourceTitles.length > 0 ? (
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">
                      refs: {inquiry.matchedSourceTitles.join(" / ")}
                    </p>
                  ) : null}
                  {inquiry.responsePreview ? (
                    <div className="mt-4 rounded-[1.2rem] border border-line bg-surface px-4 py-4 text-sm leading-6 text-muted">
                      {inquiry.responsePreview}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </SectionCard>
      </section>
    </main>
  );
}
