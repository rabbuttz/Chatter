import Link from "next/link";

import { SectionCard, StatusBadge } from "@ichijiuke/ui";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-10 lg:px-10">
      <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          eyebrow="Auth"
          title="販売者ログイン"
          description="Auth.js 導入前の stub。route と CTA の位置だけ先に固定する。"
        >
          <div className="flex flex-wrap gap-2">
            <StatusBadge label="auth stub" tone="warning" />
          </div>
          <div className="grid gap-3">
            <input
              className="rounded-[20px] border border-line bg-surface-strong px-4 py-3"
              readOnly
              value="seller@example.com"
            />
            <input
              className="rounded-[20px] border border-line bg-surface-strong px-4 py-3"
              readOnly
              value="********"
            />
            <Link
              className="inline-flex justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white"
              href="/dashboard"
            >
              ダッシュボードへ
            </Link>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Next"
          title="次に載せるもの"
          description="Worker 02 が provider と tenant gate をここに追加する。"
        >
          <ul className="space-y-3 text-sm leading-7 text-muted">
            <li>credentials / email link の選定</li>
            <li>seller と shop の紐付け</li>
            <li>setup 未完了時の `/setup` 誘導</li>
          </ul>
        </SectionCard>
      </div>
    </main>
  );
}
