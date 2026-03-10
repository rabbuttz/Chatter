import { SectionCard, StatusBadge } from "@ichijiuke/ui";

const notificationModes = [
  {
    label: "none",
    note: "記録のみ。販売者には何も送らない。",
  },
  {
    label: "summary",
    note: "要点だけまとめて販売者へ送る。",
  },
  {
    label: "urgent",
    note: "決済、安全、法的示唆を即時通知する。",
  },
] as const;

export default function NotificationsPage() {
  return (
    <>
      <SectionCard
        eyebrow="Signal Routing"
        title="通知設定"
        description="一次受けの価値はノイズ削減にある。通知は少なく、でも high risk は落とさない。"
      >
        <div className="flex flex-wrap gap-2">
          <StatusBadge label="summary default" tone="accent" />
          <StatusBadge label="urgent for risk" tone="warning" />
        </div>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-3">
        {notificationModes.map((mode) => (
          <SectionCard key={mode.label} eyebrow="Notify" title={mode.label} description={mode.note}>
            <p className="text-sm leading-7 text-muted">
              Worker 09 が通知先、配送チャネル、要約フォーマットを追加する。
            </p>
          </SectionCard>
        ))}
      </div>
    </>
  );
}
