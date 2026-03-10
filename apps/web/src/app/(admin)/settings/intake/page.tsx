import { intakeCategories } from "@ichijiuke/domain";
import { SectionCard, StatusBadge } from "@ichijiuke/ui";

export default function IntakeSettingsPage() {
  return (
    <>
      <SectionCard
        eyebrow="Policy Matrix"
        title="受付内容設定"
        description="setup で決めたカテゴリを詳細編集する画面。Worker 05 はここに quick buttons と scope message を増やす。"
      >
        <div className="flex flex-wrap gap-2">
          <StatusBadge label="category master fixed" tone="warning" />
          <StatusBadge label="mode switch only" tone="neutral" />
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Current Contract"
        title="current category policies"
        description="category と handling mode の対応表。通知粒度もここから追えるようにする。"
      >
        <div className="grid gap-3">
          {intakeCategories.map((category) => (
            <div
              key={category.code}
              className="grid gap-3 rounded-[24px] border border-line bg-surface-strong px-4 py-4 lg:grid-cols-[120px_1fr_auto_auto]"
            >
              <code className="text-xs uppercase tracking-[0.22em] text-muted">{category.code}</code>
              <div>
                <p className="font-semibold">{category.label}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{category.summary}</p>
              </div>
              <StatusBadge label={category.defaultHandling} tone="accent" />
              <StatusBadge label={category.notificationMode} tone="neutral" />
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
