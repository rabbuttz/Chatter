import { SectionCard, StatusBadge } from "@ichijiuke/ui";

import { savePublishSettingsAction } from "@/app/actions/workspace";
import { getDemoSession } from "@/lib/auth";
import { getDemoWorkspace } from "@/lib/demo-workspace";

const inputClassName =
  "rounded-[18px] border border-line bg-surface-strong px-4 py-3 text-sm outline-none";

export default async function PublishSettingsPage() {
  const session = await getDemoSession();

  if (!session) {
    return null;
  }

  const workspace = await getDemoWorkspace(session);
  const previewHref = `/c/${workspace.settings.publicSlug}`;

  return (
    <>
      <SectionCard
        eyebrow="Go Live"
        title="公開設定"
        description="公開 URL、starter buttons、scope 表示をここで最終確認します。preview と同じ情報を seller 側でも見えるようにします。"
      >
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone={workspace.settings.publicStatus === "published" ? "accent" : "neutral"}>
            {workspace.settings.publicStatus}
          </StatusBadge>
          <StatusBadge tone="neutral">{workspace.settings.publicSlug}</StatusBadge>
          <StatusBadge tone="accent">{workspace.settings.starterButtons.length} starter buttons</StatusBadge>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          eyebrow="Controls"
          title="公開面を更新する"
          description="status は draft / private preview / published を切り替えます。starter buttons は comma 区切りで微調整できます。"
        >
          <form action={savePublishSettingsAction} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Public status
                <select className={inputClassName} defaultValue={workspace.settings.publicStatus} name="publicStatus">
                  <option value="draft">draft</option>
                  <option value="private_preview">private_preview</option>
                  <option value="published">published</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Public slug
                <input className={inputClassName} defaultValue={workspace.settings.publicSlug} name="publicSlug" />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-semibold">
              Public intro
              <textarea
                className={`${inputClassName} min-h-28`}
                defaultValue={workspace.settings.publicIntroMessage}
                name="publicIntroMessage"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Scope message
              <textarea
                className={`${inputClassName} min-h-28`}
                defaultValue={workspace.settings.scopeMessage}
                name="scopeMessage"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Starter buttons
              <input
                className={inputClassName}
                defaultValue={workspace.settings.starterButtons.join(", ")}
                name="starterButtons"
              />
            </label>

            <button className="inline-flex w-fit rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white" type="submit">
              公開設定を保存
            </button>
          </form>
        </SectionCard>

        <SectionCard
          eyebrow="Preview"
          title="公開チャットの見え方"
          description="scope と intro は public page の冒頭にそのまま出ます。seller 側からも preview で確認できます。"
        >
          <div className="rounded-[1.6rem] border border-line bg-surface-strong px-4 py-4">
            <p className="text-xs uppercase tracking-[0.22em] text-muted">public url</p>
            <code className="mt-3 inline-flex rounded-full border border-line bg-surface px-4 py-2 text-sm">
              {previewHref}
            </code>
            <p className="mt-4 text-sm leading-7 text-muted">{workspace.settings.publicIntroMessage}</p>
            <div className="mt-4 rounded-[1.2rem] border border-line bg-surface px-4 py-4 text-sm leading-7 text-muted">
              {workspace.settings.scopeMessage}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {workspace.settings.starterButtons.map((button) => (
                <span key={button} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold">
                  {button}
                </span>
              ))}
            </div>
            <a className="mt-6 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white" href={previewHref}>
              public preview
            </a>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
