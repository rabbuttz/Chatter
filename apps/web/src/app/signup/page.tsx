import { redirect } from "next/navigation";

import { sellerTypes } from "@ichijiuke/domain";
import { SectionCard, StatusBadge } from "@ichijiuke/ui";

import { signupDemoAction } from "@/app/actions/auth";
import { getDemoSession, isProductionAuthEnabled } from "@/lib/auth";

export const dynamic = "force-dynamic";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const session = await getDemoSession();
  const isProductionAuth = isProductionAuthEnabled();
  const resolvedSearchParams = await searchParams;

  if (session) {
    redirect("/setup");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-10 lg:px-10">
      <SectionCard
        eyebrow="Entry"
        title="販売者登録の入口"
        description={
          isProductionAuth
            ? "アカウントを作成すると DB に販売者レコードと初期 workspace を作り、そのまま setup へ流します。"
            : "env 未設定時は demo seller を即時発行して setup を確認できます。"
        }
      >
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone="accent">{isProductionAuth ? "production signup" : "demo signup"}</StatusBadge>
          <StatusBadge tone="neutral">{isProductionAuth ? "db + session cookie" : "cookie session"}</StatusBadge>
          {resolvedSearchParams.error ? <StatusBadge label={resolvedSearchParams.error} tone="warning" /> : null}
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
          <form action={signupDemoAction} className="rounded-[1.6rem] border border-line bg-surface px-5 py-5">
            <p className="text-sm font-semibold">最初に持たせる入力</p>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-2 text-sm font-semibold">
                Display name
                <input
                  className="rounded-[20px] border border-line bg-surface-strong px-4 py-3 font-normal"
                  defaultValue={isProductionAuth ? "" : "Demo Seller"}
                  name="displayName"
                  placeholder="Demo Seller"
                  type="text"
                />
              </label>
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
              <label className="grid gap-2 text-sm font-semibold">
                Password
                <input
                  className="rounded-[20px] border border-line bg-surface-strong px-4 py-3 font-normal"
                  name="password"
                  placeholder={isProductionAuth ? "12 文字以上" : "demo mode では未使用"}
                  type="password"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Seller type
                <select
                  className="rounded-[20px] border border-line bg-surface-strong px-4 py-3 font-normal"
                  defaultValue="hybrid"
                  name="sellerType"
                >
                  {sellerTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              className="mt-6 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white"
              type="submit"
            >
              セットアップへ進む
            </button>
          </form>
        </div>
      </SectionCard>
    </main>
  );
}
