import { MetricCard, SectionCard, StatusBadge } from "@ichijiuke/ui";

const dashboardMetrics = [
  {
    label: "published",
    value: "draft",
    note: "公開トグルと URL 発行は `/settings/publish` で最終確定する。",
  },
  {
    label: "today",
    value: "12",
    note: "一次受け件数。MVP では簡易集計で十分。",
  },
  {
    label: "urgent",
    value: "2",
    note: "決済・安全・法的示唆の即時通知対象。",
  },
] as const;

export default function DashboardPage() {
  return (
    <>
      <SectionCard
        eyebrow="Overview"
        title="ダッシュボード"
        description="管理画面の中心。設定完了度、公開状態、直近通知だけが見えれば MVP として成立する。"
      >
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone="accent">setup first</StatusBadge>
          <StatusBadge tone="neutral">summary before raw</StatusBadge>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-3">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} note={metric.note} value={metric.value} />
        ))}
      </div>
    </>
  );
}
