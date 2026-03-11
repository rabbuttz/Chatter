import Link from "next/link";
import { redirect } from "next/navigation";

import { SectionCard, StatusBadge } from "@ichijiuke/ui";

import { loginDemoAction } from "@/app/actions/auth";
import { getDemoSession, isProductionAuthEnabled } from "@/lib/auth";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getDemoSession();
  const isProductionAuth = isProductionAuthEnabled();
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
          description={
            isProductionAuth
              ? "メールアドレスとパスワードでログインし、署名付き session cookie で管理画面へ入ります。"
              : "env 未設定時は demo session を cookie に保存してローカル確認できます。"
          }
        >
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={isProductionAuth ? "signed session" : "demo session"} tone="accent" />
            <StatusBadge label="route redirect" tone="neutral" />
            {resolvedSearchParams.error ? <StatusBadge label={resolvedSearchParams.error} tone="warning" /> : null}
          </div>
          <form action={loginDemoAction} className="grid gap-3">
            <input type="hidden" name="next" value={nextPath} />
            <label className="grid gap-2 text-sm font-semibold">
              Email
              <input
                className="rounded-[20px] border border-line bg-surface-strong px-4 py-3 font-normal"
                defaultValue={isProductionAuth ? "" : "seller@example.com"}
                name="email"
                placeholder="seller@example.com"
                type="email"
              />
            </label>
            {isProductionAuth ? (
              <label className="grid gap-2 text-sm font-semibold">
                Password
                <input
                  className="rounded-[20px] border border-line bg-surface-strong px-4 py-3 font-normal"
                  name="password"
                  placeholder="12 文字以上のパスワード"
                  type="password"
                />
              </label>
            ) : (
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
            )}
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
          title="本番化の前提"
          description="admin route の保護、public slug ごとの保存、session cookie の検証まで入れば本番用の基礎になります。"
        >
          <ul className="space-y-3 text-sm leading-7 text-muted">
            <li>未ログインで `/dashboard` に入ると `/login` へリダイレクト</li>
            <li>production mode では DB 登録済みアカウントのみログイン可能</li>
            <li>env 未設定時は demo fallback で UI 確認を継続可能</li>
          </ul>
          <Link className="mt-6 inline-flex text-sm font-semibold text-accent" href="/signup">
            新規登録へ
          </Link>
        </SectionCard>
      </div>
    </main>
  );
}
