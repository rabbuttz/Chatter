import { inboxPreview } from "@ichijiuke/inquiry-engine";
import { SectionCard, StatusBadge } from "@ichijiuke/ui";

export default function InboxPage() {
  return (
    <>
      <SectionCard
        eyebrow="Handoff Queue"
        title="受信箱"
        description="raw message を全面に出さず、category / action / urgency / suggested reply を先に見る。"
      >
        <div className="flex flex-wrap gap-2">
          <StatusBadge label="summary first" tone="accent" />
          <StatusBadge label="raw later" tone="neutral" />
        </div>
      </SectionCard>

      <SectionCard eyebrow="Engine Stub" title="recent preview" description="inquiry-engine の stub を接続している。">
        <div className="grid gap-3">
          {inboxPreview.map((item) => (
            <div key={item.message} className="rounded-[24px] border border-line bg-surface-strong px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold">{item.categoryLabel}</p>
                <StatusBadge label={item.urgency} tone={item.urgency === "urgent" ? "warning" : "accent"} />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{item.message}</p>
              <p className="mt-3 text-sm font-medium">{item.suggestedReply}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
