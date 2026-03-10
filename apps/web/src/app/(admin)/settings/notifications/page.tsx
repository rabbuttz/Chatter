import { intakeCategoryByCode } from "@ichijiuke/domain";
import { SectionCard, StatusBadge } from "@ichijiuke/ui";

import { saveNotificationSettingsAction } from "@/app/actions/workspace";
import { getDemoSession } from "@/lib/auth";
import { getDemoWorkspace } from "@/lib/demo-workspace";

const inputClassName =
  "rounded-[18px] border border-line bg-surface-strong px-4 py-3 text-sm outline-none";

export default async function NotificationsPage() {
  const session = await getDemoSession();

  if (!session) {
    return null;
  }

  const workspace = await getDemoWorkspace(session);
  const urgentPolicies = workspace.settings.policies.filter(
    (policy) => policy.isEnabled && policy.notificationMode === "urgent",
  );
  const summaryPolicies = workspace.settings.policies.filter(
    (policy) => policy.isEnabled && policy.notificationMode === "summary",
  );
  const mutedPolicies = workspace.settings.policies.filter(
    (policy) => policy.isEnabled && policy.notificationMode === "none",
  );

  return (
    <>
      <SectionCard
        eyebrow="Signal Routing"
        title="通知設定"
        description="通知の価値は件数ではなく選別精度にあります。urgent は本当に落とせないものだけ、残りは summary で整理します。"
      >
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone="accent">summary default</StatusBadge>
          <StatusBadge tone="warning">urgent for risk</StatusBadge>
          <StatusBadge tone="neutral">{workspace.notifications.length} saved notifications</StatusBadge>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionCard
          eyebrow="Owner"
          title="通知先"
          description="MVP では email を 1 つだけ持てば十分です。raw 原文ではなく要点要約が先に来る前提にします。"
        >
          <form action={saveNotificationSettingsAction} className="grid gap-4">
            <label className="grid gap-2 text-sm font-semibold">
              Notification email
              <input
                className={inputClassName}
                defaultValue={workspace.settings.notificationEmail}
                name="notificationEmail"
                type="email"
              />
            </label>
            <button className="inline-flex w-fit rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white" type="submit">
              通知設定を保存
            </button>
          </form>
        </SectionCard>

        <SectionCard
          eyebrow="Policy"
          title="カテゴリごとの通知方針"
          description="実際の通知ルールは intake policy から引き継ぎます。ここでは何が muted / summary / urgent なのかを可視化します。"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">muted</p>
                <StatusBadge tone="neutral">{mutedPolicies.length}</StatusBadge>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-muted">
                {mutedPolicies.map((policy) => (
                  <p key={policy.categoryCode}>{intakeCategoryByCode[policy.categoryCode]?.label ?? policy.categoryCode}</p>
                ))}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">summary</p>
                <StatusBadge tone="accent">{summaryPolicies.length}</StatusBadge>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-muted">
                {summaryPolicies.map((policy) => (
                  <p key={policy.categoryCode}>{intakeCategoryByCode[policy.categoryCode]?.label ?? policy.categoryCode}</p>
                ))}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">urgent</p>
                <StatusBadge tone="warning">{urgentPolicies.length}</StatusBadge>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-muted">
                {urgentPolicies.map((policy) => (
                  <p key={policy.categoryCode}>{intakeCategoryByCode[policy.categoryCode]?.label ?? policy.categoryCode}</p>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
