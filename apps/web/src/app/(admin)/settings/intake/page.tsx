import { intakeCategoryByCode } from "@ichijiuke/domain";
import { SectionCard, StatusBadge } from "@ichijiuke/ui";

import { saveIntakePoliciesAction } from "@/app/actions/workspace";
import { getDemoSession } from "@/lib/auth";
import { getDemoWorkspace } from "@/lib/demo-workspace";

const selectClassName =
  "rounded-[18px] border border-line bg-surface-strong px-3 py-2 text-sm outline-none";

export default async function IntakeSettingsPage() {
  const session = await getDemoSession();

  if (!session) {
    return null;
  }

  const workspace = await getDemoWorkspace(session);

  return (
    <>
      <SectionCard
        eyebrow="Policy Matrix"
        title="受付内容設定"
        description="カテゴリ master は固定し、enabled / handling / notify だけを切り替えます。通知ノイズはここで抑えます。"
      >
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone="warning">category master fixed</StatusBadge>
          <StatusBadge tone="neutral">mode switch only</StatusBadge>
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Current Contract"
        title="category policies"
        description="高リスクカテゴリは urgent に寄せ、それ以外は summary か none に留めるのが基本です。"
      >
        <form action={saveIntakePoliciesAction} className="grid gap-3">
          {workspace.settings.policies.map((policy) => {
            const category = intakeCategoryByCode[policy.categoryCode];

            return (
              <div
                key={policy.categoryCode}
                className="grid gap-3 rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4 lg:grid-cols-[120px_1fr_150px_150px_180px]"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">{policy.categoryCode}</p>
                  <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
                    <input defaultChecked={policy.isEnabled} name={`enabled:${policy.categoryCode}`} type="checkbox" />
                    enabled
                  </label>
                </div>

                <div>
                  <p className="font-semibold">{category?.label ?? policy.categoryCode}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{category?.summary}</p>
                </div>

                <label className="grid gap-2 text-sm font-semibold">
                  Handling
                  <select className={selectClassName} defaultValue={policy.handlingMode} name={`handling:${policy.categoryCode}`}>
                    <option value="auto_answer">auto_answer</option>
                    <option value="policy_redirect">policy_redirect</option>
                    <option value="handoff">handoff</option>
                    <option value="urgent_handoff">urgent_handoff</option>
                    <option value="reject">reject</option>
                    <option value="log_only">log_only</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-semibold">
                  Notify
                  <select
                    className={selectClassName}
                    defaultValue={policy.notificationMode}
                    name={`notification:${policy.categoryCode}`}
                  >
                    <option value="none">none</option>
                    <option value="summary">summary</option>
                    <option value="urgent">urgent</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-semibold">
                  Starter label
                  <input
                    className={selectClassName}
                    defaultValue={policy.starterButtonLabel}
                    name={`starter:${policy.categoryCode}`}
                    placeholder="公開チャットのボタン文言"
                  />
                </label>
              </div>
            );
          })}

          <button className="mt-2 inline-flex w-fit rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white" type="submit">
            受付内容を保存
          </button>
        </form>
      </SectionCard>
    </>
  );
}
