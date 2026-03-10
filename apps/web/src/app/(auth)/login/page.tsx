import Link from "next/link";
import { redirect } from "next/navigation";

import { SectionCard, StatusBadge } from "@ichijiuke/ui";

import { loginDemoAction } from "@/app/actions/auth";
import { getDemoSession } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getDemoSession();
  const resolvedSearchParams = await searchParams;
  const nextPath = resolvedSearchParams.next ?? "/dashboard";

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-10 lg:px-10">
      <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          eyebrow="Auth"
          title="販売者ログイン"
          description="MVP scaffold として動く demo session を cookie に保存します。本番 auth は後続で差し替えます。"
        >
          <div className="flex flex-wrap gap-2">
            <StatusBadge label="cookie session" tone="accent" />
            <StatusBadge label="route redirect" tone="neutral" />
            {resolvedSearchParams.error ? <StatusBadge label={resolvedSearchParams.error} tone="warning" /> : null}
          </div>
          <form action={loginDemoAction} className="grid gap-3">
            <input type="hidden" name="next" value={nextPath} />
            <label className="grid gap-2 text-sm font-semibold">
              Email
              <input
                className="rounded-[20px] border border-line bg-surface-strong px-4 py-3 font-normal"
                defaultValue="seller@example.com"
                name="email"
                placeholder="seller@example.com"
                type="email"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Display name
              <input
                className="rounded-[20px] border border-line bg-surface-strong px-4 py-3 font-normal"
                defaultValue="Demo Seller"
                name="displayName"
                placeholder="Demo Seller"
                type="text"
              />
            </label>
            <button
              className="inline-flex justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white"
              type="submit"
            >
              ダッシュボードへ入る
            </button>
          </form>
        </SectionCard>

        <SectionCard
          eyebrow="Next"
          title="この最小実装で十分なこと"
          description="admin route の保護と demo session の可視化が通れば、Auth.js 導入前でも開発は進められます。"
        >
          <ul className="space-y-3 text-sm leading-7 text-muted">
            <li>未ログインで `/dashboard` に入ると `/login` へリダイレクト</li>
            <li>login 成功後は cookie session を発行</li>
            <li>signup からも同じ cookie session を作成</li>
          </ul>
          <Link className="mt-6 inline-flex text-sm font-semibold text-accent" href="/signup">
            新規登録へ
          </Link>
        </SectionCard>
      </div>
    </main>
  );
}
