import { MetricCard, SectionCard, StatusBadge } from "@ichijiuke/ui";

import { getDemoSession } from "@/lib/auth";
import { getDemoWorkspace, getWorkspaceMetrics } from "@/lib/demo-workspace";

function buildNextActions(args: {
  completionPercent: number;
  published: boolean;
  notificationCount: number;
  urgentCount: number;
  knowledgeCount: number;
}) {
  const actions: string[] = [];

  if (args.completionPercent < 100) {
    actions.push("setup を完了させて公開前の不足項目を埋める");
  }

  if (args.knowledgeCount < 4) {
    actions.push("FAQ / 規約を追加して自動回答の根拠を厚くする");
  }

  if (!args.published) {
    actions.push("公開状態を private preview 以上にして URL を配布できるようにする");
  }

  if (args.urgentCount > 0) {
    actions.push("urgent 通知を先に確認し、決済・安全系を後回しにしない");
  } else if (args.notificationCount > 0) {
    actions.push("要約通知から販売者確認が必要なものだけ対応する");
  }

  return actions.length > 0 ? actions : ["現在の設定は MVP 公開ラインに達しています。"];
}

export default async function DashboardPage() {
  const session = await getDemoSession();

  if (!session) {
    return null;
  }

  const workspace = await getDemoWorkspace(session);
  const metrics = getWorkspaceMetrics(workspace);
  const recentNotifications = workspace.notifications.slice(0, 3);
  const nextActions = buildNextActions({
    completionPercent: metrics.completionPercent,
    published: metrics.published,
    notificationCount: metrics.notificationCount,
    urgentCount: metrics.urgentCount,
    knowledgeCount: workspace.knowledgeSources.length,
  });

  return (
    <>
      <SectionCard
        eyebrow="Overview"
        title="ダッシュボード"
        description="公開状況、通知ノイズ、一次受けの完結率を先に確認する。MVP では raw より先に summary を見る。"
      >
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone={metrics.published ? "accent" : "warning"}>
            {metrics.published ? "published" : workspace.settings.publicStatus}
          </StatusBadge>
          <StatusBadge tone="neutral">{workspace.settings.publicSlug}</StatusBadge>
          <StatusBadge tone={metrics.urgentCount > 0 ? "warning" : "neutral"}>
            urgent {metrics.urgentCount}
          </StatusBadge>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-5">
        <MetricCard
          label="completion"
          value={`${metrics.completionPercent}%`}
          note="公開前に必要な設定の充足率"
        />
        <MetricCard label="inquiries" value={String(metrics.totalInquiries)} note="保存済みの問い合わせ件数" />
        <MetricCard label="auto closed" value={String(metrics.autoClosedCount)} note="AI / 規約案内で完結" />
        <MetricCard label="handoff" value={String(metrics.handoffCount)} note="販売者確認が必要" />
        <MetricCard label="notifications" value={String(metrics.notificationCount)} note="summary + urgent の合計" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          eyebrow="Next"
          title="次にやること"
          description="販売者が迷わないよう、現在の状態から必要なアクションだけを絞って出します。"
        >
          <div className="grid gap-3">
            {nextActions.map((action) => (
              <div key={action} className="rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4 text-sm">
                {action}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Recent"
          title="最近の通知"
          description="原文を前面に出さず、カテゴリと要点で先に把握する。"
        >
          <div className="grid gap-3">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold">{notification.headline}</p>
                    <StatusBadge tone={notification.urgency === "urgent" ? "warning" : "accent"}>
                      {notification.urgency}
                    </StatusBadge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{notification.summary}</p>
                  <p className="mt-3 text-sm">{notification.suggestedAction}</p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-muted">まだ通知はありません。public preview から問い合わせると受信箱に反映されます。</p>
            )}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
