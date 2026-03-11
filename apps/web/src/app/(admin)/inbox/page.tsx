import { intakeCategoryByCode } from "@ichijiuke/domain";
import { MetricCard, SectionCard, StatusBadge } from "@ichijiuke/ui";

import { getDemoSession } from "@/lib/auth";
import { getDemoWorkspace, getWorkspaceMetrics } from "@/lib/demo-workspace";
import { getInquiryResponseMode } from "@/lib/env";

export default async function InboxPage() {
  const session = await getDemoSession();

  if (!session) {
    return null;
  }

  const workspace = await getDemoWorkspace(session);
  const metrics = getWorkspaceMetrics(workspace);
  const inquiryResponseMode = getInquiryResponseMode();

  return (
    <>
      <SectionCard
        eyebrow="Handoff Queue"
        title="受信箱"
        description="raw message を全面に出さず、category / summary / suggested action / references から先に確認します。"
      >
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone="accent">summary first</StatusBadge>
          <StatusBadge tone="neutral">raw later</StatusBadge>
          <StatusBadge tone="neutral">
            {inquiryResponseMode === "openai" ? "openai active" : "rules fallback"}
          </StatusBadge>
          <StatusBadge tone={metrics.urgentCount > 0 ? "warning" : "neutral"}>
            urgent {metrics.urgentCount}
          </StatusBadge>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-4">
        <MetricCard label="saved" value={String(workspace.inquiries.length)} note="保存済み問い合わせ" />
        <MetricCard label="handoff" value={String(metrics.handoffCount)} note="販売者確認が必要" />
        <MetricCard label="urgent" value={String(metrics.urgentCount)} note="即時確認対象" />
        <MetricCard label="summary" value={String(metrics.notificationCount)} note="通知として積まれた件数" />
      </div>

      <SectionCard
        eyebrow="Queue"
        title="saved inquiries"
        description="新しいものが上に来ます。参照された knowledge title と suggested action を先に確認できます。"
      >
        <div className="grid gap-3">
          {workspace.inquiries.map((inquiry) => {
            const category = intakeCategoryByCode[inquiry.categoryCode];
            const notification = workspace.notifications.find(
              (item) => item.inquiryId === inquiry.id,
            );

            return (
              <div
                key={inquiry.id}
                className="rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold">{category?.label ?? inquiry.categoryCode}</p>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge tone={notification?.urgency === "urgent" ? "warning" : "accent"}>
                      {notification?.urgency ?? inquiry.notificationMode}
                    </StatusBadge>
                    <StatusBadge tone="neutral">
                      {inquiry.responseSource}
                      {inquiry.responseModel ? `:${inquiry.responseModel}` : ""}
                    </StatusBadge>
                    <StatusBadge tone="neutral">{inquiry.status}</StatusBadge>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-muted">{inquiry.summary ?? category?.summary}</p>

                {notification ? (
                  <div className="mt-3 rounded-[1.2rem] border border-line bg-surface px-4 py-4">
                    <p className="text-sm font-semibold">{notification.headline}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{notification.suggestedAction}</p>
                    {notification.referenceTitles.length > 0 ? (
                      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">
                        refs: {notification.referenceTitles.join(" / ")}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-muted">raw preview</summary>
                  <p className="mt-3 text-sm leading-6">{inquiry.rawMessage}</p>
                  {inquiry.responsePreview ? (
                    <div className="mt-3 rounded-[1.2rem] border border-line bg-surface px-4 py-4 text-sm leading-6 text-muted">
                      {inquiry.responsePreview}
                    </div>
                  ) : null}
                </details>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </>
  );
}
