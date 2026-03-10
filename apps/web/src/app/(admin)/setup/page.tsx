import { sellerTypes, setupSteps } from "@ichijiuke/domain";
import { SectionCard, StatusBadge } from "@ichijiuke/ui";

import { saveSetupAction } from "@/app/actions/workspace";
import { getDemoSession } from "@/lib/auth";
import { getDemoWorkspace, getEnabledPolicies } from "@/lib/demo-workspace";

const inputClassName =
  "rounded-[20px] border border-line bg-surface-strong px-4 py-3 text-sm outline-none";

export default async function SetupPage() {
  const session = await getDemoSession();

  if (!session) {
    return null;
  }

  const workspace = await getDemoWorkspace(session);
  const enabledPolicies = getEnabledPolicies(workspace);

  return (
    <>
      <SectionCard
        eyebrow="Setup Wizard"
        title="3〜5 分で公開まで進める"
        description="ショップの運用方針を一度決めると、knowledge / notifications / publish に同じ設定が流れます。"
      >
        <div className="flex flex-wrap gap-2">
          {setupSteps.map((step, index) => (
            <StatusBadge key={step} tone={index < 2 || workspace.settings.setupCompleted ? "accent" : "neutral"}>
              {step}
            </StatusBadge>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          eyebrow="Core"
          title="ショップの前提を決める"
          description="ここで決めた seller type と案内文が、公開チャットと通知の初期値になります。"
        >
          <form action={saveSetupAction} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Shop name
                <input className={inputClassName} defaultValue={workspace.settings.shopName} name="shopName" />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Public slug
                <input className={inputClassName} defaultValue={workspace.settings.publicSlug} name="publicSlug" />
              </label>
            </div>

            <fieldset className="grid gap-3">
              <legend className="text-sm font-semibold">Seller type</legend>
              <div className="grid gap-3">
                {sellerTypes.map((sellerType) => (
                  <label
                    key={sellerType.value}
                    className="rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        defaultChecked={workspace.settings.sellerType === sellerType.value}
                        name="sellerType"
                        type="radio"
                        value={sellerType.value}
                      />
                      <div>
                        <p className="font-semibold">{sellerType.label}</p>
                        <p className="mt-2 text-sm leading-6 text-muted">{sellerType.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Auto reply tone
                <select className={inputClassName} defaultValue={workspace.settings.autoReplyTone} name="autoReplyTone">
                  <option value="neutral">neutral</option>
                  <option value="warm">warm</option>
                  <option value="firm">firm</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Notification email
                <input
                  className={inputClassName}
                  defaultValue={workspace.settings.notificationEmail}
                  name="notificationEmail"
                  type="email"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold">
              Public intro
              <textarea
                className={`${inputClassName} min-h-28`}
                defaultValue={workspace.settings.publicIntroMessage}
                name="publicIntroMessage"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Scope message
              <textarea
                className={`${inputClassName} min-h-28`}
                defaultValue={workspace.settings.scopeMessage}
                name="scopeMessage"
              />
            </label>

            <label className="flex items-center gap-3 text-sm font-semibold">
              <input name="resetPolicies" type="checkbox" />
              seller type に合わせてカテゴリ初期値を再生成する
            </label>

            <button className="inline-flex w-fit rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white" type="submit">
              セットアップを保存
            </button>
          </form>
        </SectionCard>

        <SectionCard
          eyebrow="Result"
          title="現在の初期化結果"
          description="setup の段階では categories を自由追加せず、固定 master の中で enabled policy を決めます。"
        >
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="accent">{workspace.settings.sellerType}</StatusBadge>
            <StatusBadge tone="neutral">{enabledPolicies.length} categories enabled</StatusBadge>
            <StatusBadge tone={workspace.settings.setupCompleted ? "accent" : "warning"}>
              {workspace.settings.setupCompleted ? "ready" : "draft"}
            </StatusBadge>
          </div>
          <div className="mt-6 grid gap-3">
            {enabledPolicies.slice(0, 6).map((policy) => (
              <div key={policy.categoryCode} className="rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold">{policy.categoryCode}</p>
                  <StatusBadge tone="neutral">{policy.handlingMode}</StatusBadge>
                </div>
                <p className="mt-2 text-sm text-muted">
                  notify: {policy.notificationMode}
                  {policy.starterButtonLabel ? ` / starter: ${policy.starterButtonLabel}` : ""}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
