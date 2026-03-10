import Link from "next/link";
import { adminRoutes, intakeCategories, sellerTypes } from "@ichijiuke/domain";
import { MetricCard, SectionCard, StatusBadge } from "@ichijiuke/ui";

import { logoutDemoAction } from "@/app/actions/auth";
import { getDemoSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getDemoSession();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <SectionCard
          eyebrow="Workspace"
          title="Ichijiuke MVP scaffold"
          description="seller/admin と public chat を1つの Next.js App Router アプリで持ち、共有契約と UI を workspace package に切り出した初期土台です。"
        >
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="accent">leader: xhigh 相当</StatusBadge>
            <StatusBadge tone="neutral">workers: high 相当</StatusBadge>
            <StatusBadge tone="warning">MVP first</StatusBadge>
            {session ? <StatusBadge tone="accent">{session.email}</StatusBadge> : null}
          </div>
          {session ? (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
              <p>demo session: {session.displayName}</p>
              <form action={logoutDemoAction}>
                <button className="font-semibold text-accent" type="submit">
                  sign out
                </button>
              </form>
            </div>
          ) : null}
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <MetricCard label="workspace" value="apps + packages" note="責務単位で分離" />
            <MetricCard label="routes" value={String(adminRoutes.length + 3)} note="admin + public" />
            <MetricCard label="categories" value={String(intakeCategories.length)} note="初期マスタ" />
          </div>
        </SectionCard>
        <SectionCard
          eyebrow="Stack"
          title="最小 package 分割"
          description="Web app は1つ、共有責務は package 化。過分割は避けて、10人が同時に触っても衝突しにくい境界だけ残します。"
        >
          <ul className="space-y-3 text-sm text-muted">
            <li>`apps/web`: admin と public chat の実画面</li>
            <li>`packages/domain`: 設定スキーマとカテゴリ契約</li>
            <li>`packages/inquiry-engine`: 一次受け判定ロジック</li>
            <li>`packages/ui`: 共有シェルと表示部品</li>
            <li>`packages/db`: DB / 監査 / 履歴の受け皿</li>
          </ul>
        </SectionCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Link href={session ? "/setup" : "/signup"}>
          <SectionCard eyebrow="Entry" title="販売者導線" description="登録画面と公開までの最短導線を確認する。">
            <p className="text-sm text-muted">{session ? "`/setup` へ直行" : "`/signup` と `/setup` を先行着手"}</p>
          </SectionCard>
        </Link>
        <Link href={session ? "/dashboard" : "/login"}>
          <SectionCard eyebrow="Admin" title="管理画面" description="ダッシュボード、設定、履歴の導線を俯瞰する。">
            <p className="text-sm text-muted">{session ? "demo session で入場可能" : "未ログイン時は `/login` へ誘導"}</p>
          </SectionCard>
        </Link>
        <Link href="/c/demo-shop">
          <SectionCard eyebrow="Public" title="公開チャット" description="購入者向けの一次受け体験を見る。">
            <p className="text-sm text-muted">`/c/[slug]` で public surface を分離</p>
          </SectionCard>
        </Link>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          eyebrow="MVP"
          title="最初に固定するもの"
          description="UI より先に、設定スキーマとカテゴリ/アクションを固定します。"
        >
          <div className="grid gap-3 md:grid-cols-2">
            {sellerTypes.map((sellerType) => (
              <div key={sellerType.value} className="rounded-3xl border border-line bg-surface px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted">{sellerType.value}</p>
                <p className="mt-2 text-lg font-semibold">{sellerType.label}</p>
                <p className="mt-2 text-sm text-muted">{sellerType.description}</p>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard
          eyebrow="Contract"
          title="初期カテゴリ"
          description="カテゴリは MVP 中に自由追加しません。Worker 01 の契約を唯一の参照元にします。"
        >
          <div className="grid gap-3">
            {intakeCategories.slice(0, 4).map((category) => (
              <div key={category.code} className="flex items-start justify-between gap-4 rounded-3xl border border-line bg-surface px-4 py-4">
                <div>
                  <p className="font-semibold">{category.label}</p>
                  <p className="mt-1 text-sm text-muted">{category.summary}</p>
                </div>
                <StatusBadge tone="neutral">{category.defaultHandling}</StatusBadge>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </main>
  );
}
