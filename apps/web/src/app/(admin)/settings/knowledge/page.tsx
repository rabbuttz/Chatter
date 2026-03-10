import { knowledgeSourceTypeValues } from "@ichijiuke/domain";
import { SectionCard, StatusBadge } from "@ichijiuke/ui";

import {
  createKnowledgeSourceAction,
  updateKnowledgeSourceStatusAction,
} from "@/app/actions/workspace";
import { getDemoSession } from "@/lib/auth";
import { getDemoWorkspace, getKnowledgeSourcesByType } from "@/lib/demo-workspace";

const inputClassName =
  "rounded-[18px] border border-line bg-surface-strong px-4 py-3 text-sm outline-none";

export default async function KnowledgeSettingsPage() {
  const session = await getDemoSession();

  if (!session) {
    return null;
  }

  const workspace = await getDemoWorkspace(session);
  const groupedSources = getKnowledgeSourcesByType(workspace);

  return (
    <>
      <SectionCard
        eyebrow="Grounding"
        title="FAQ / 規約 / 商品情報"
        description="AI の返答根拠をここに集めます。published を増やすほど、public chat の自由回答幅を狭められます。"
      >
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone="accent">faq first</StatusBadge>
          <StatusBadge tone="neutral">policy redirect</StatusBadge>
          <StatusBadge tone="neutral">{workspace.knowledgeSources.length} sources</StatusBadge>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          eyebrow="Create"
          title="根拠情報を追加する"
          description="MVP では type / title / body / tags に絞り、まずは published と draft を管理します。"
        >
          <form action={createKnowledgeSourceAction} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Type
                <select className={inputClassName} defaultValue="faq" name="sourceType">
                  {knowledgeSourceTypeValues.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Status
                <select className={inputClassName} defaultValue="published" name="status">
                  <option value="published">published</option>
                  <option value="draft">draft</option>
                  <option value="archived">archived</option>
                </select>
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold">
              Title
              <input className={inputClassName} name="title" placeholder="返品・交換ポリシー" />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Tags
              <input className={inputClassName} name="tags" placeholder="返品, 交換, キャンセル" />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Body
              <textarea className={`${inputClassName} min-h-36`} name="body" placeholder="回答の根拠になる本文を入れる" />
            </label>

            <button className="inline-flex w-fit rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white" type="submit">
              根拠情報を追加
            </button>
          </form>
        </SectionCard>

        <SectionCard
          eyebrow="Current"
          title="現在の根拠セット"
          description="type ごとに grouped 表示し、公開中のものだけを public chat の根拠として使います。"
        >
          <div className="grid gap-4">
            {knowledgeSourceTypeValues.map((type) => (
              <div key={type} className="rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold uppercase tracking-[0.18em]">{type}</p>
                  <StatusBadge tone="neutral">{groupedSources[type].length}</StatusBadge>
                </div>

                <div className="mt-4 grid gap-3">
                  {groupedSources[type].map((source) => (
                    <div key={source.id} className="rounded-[1.2rem] border border-line bg-surface px-4 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-semibold">{source.title}</p>
                        <StatusBadge tone={source.status === "published" ? "accent" : "neutral"}>
                          {source.status}
                        </StatusBadge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted">{source.body}</p>
                      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted">{source.tags.join(" / ")}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {source.status !== "published" ? (
                          <form action={updateKnowledgeSourceStatusAction}>
                            <input name="sourceId" type="hidden" value={source.id} />
                            <input name="status" type="hidden" value="published" />
                            <button className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white" type="submit">
                              publish
                            </button>
                          </form>
                        ) : null}
                        {source.status !== "archived" ? (
                          <form action={updateKnowledgeSourceStatusAction}>
                            <input name="sourceId" type="hidden" value={source.id} />
                            <input name="status" type="hidden" value="archived" />
                            <button className="rounded-full border border-line px-4 py-2 text-xs font-semibold" type="submit">
                              archive
                            </button>
                          </form>
                        ) : null}
                        {source.status !== "draft" ? (
                          <form action={updateKnowledgeSourceStatusAction}>
                            <input name="sourceId" type="hidden" value={source.id} />
                            <input name="status" type="hidden" value="draft" />
                            <button className="rounded-full border border-line px-4 py-2 text-xs font-semibold" type="submit">
                              draft
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
