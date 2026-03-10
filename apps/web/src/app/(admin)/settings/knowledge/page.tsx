import { SectionCard, StatusBadge } from "@ichijiuke/ui";

const knowledgeAreas = ["FAQ", "規約", "商品情報", "販売チャネル"] as const;

export default function KnowledgeSettingsPage() {
  return (
    <>
      <SectionCard
        eyebrow="Grounding"
        title="FAQ / 規約 / 商品情報"
        description="AI の返答根拠をここに集める。MVP では FAQ と規約を主軸にし、商品情報は最小項目で始める。"
      >
        <div className="flex flex-wrap gap-2">
          <StatusBadge label="faq first" tone="accent" />
          <StatusBadge label="policy redirect" tone="neutral" />
        </div>
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2">
        {knowledgeAreas.map((area) => (
          <SectionCard
            key={area}
            eyebrow="Knowledge"
            title={area}
            description="editor と preview は後続実装。今は route と責務だけ固定している。"
          >
            <p className="text-sm leading-7 text-muted">
              Worker 06 が CRUD と preview をここに載せる。
            </p>
          </SectionCard>
        ))}
      </div>
    </>
  );
}
