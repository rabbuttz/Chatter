import Link from "next/link";

import { sellerTypes } from "@ichijiuke/domain";
import { SectionCard, StatusBadge } from "@ichijiuke/ui";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-10 lg:px-10">
      <SectionCard
        eyebrow="Entry"
        title="販売者登録の入口"
        description="認証実装前に、MVPが集めるべき初期情報と導線だけを固定します。"
      >
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone="accent">worker 02</StatusBadge>
          <StatusBadge tone="neutral">auth pending</StatusBadge>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            {sellerTypes.map((item) => (
              <div key={item.value} className="rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">{item.value}</p>
                <p className="mt-2 text-lg font-semibold">{item.label}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="rounded-[1.6rem] border border-line bg-surface px-5 py-5">
            <p className="text-sm font-semibold">最初に持たせる入力</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
              <li>ショップ名</li>
              <li>メールアドレス</li>
              <li>公開 URL 候補</li>
              <li>ショップタイプ</li>
              <li>初期プリセット</li>
            </ul>
            <Link
              href="/setup"
              className="mt-6 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white"
            >
              セットアップへ進む
            </Link>
          </div>
        </div>
      </SectionCard>
    </main>
  );
}
