import Link from "next/link";

import { SectionCard, StatusBadge } from "@ichijiuke/ui";

export default function PublishSettingsPage() {
  return (
    <>
      <SectionCard
        eyebrow="Go Live"
        title="公開設定"
        description="公開 URL、開始導線、受付範囲表示をここで決める。公開チャットの見え方と同時に管理する。"
      >
        <div className="flex flex-wrap gap-2">
          <StatusBadge label="public slug" tone="neutral" />
          <StatusBadge label="starter buttons" tone="accent" />
        </div>
      </SectionCard>

      <SectionCard
        eyebrow="Preview"
        title="preview link"
        description="公開チャットは短い URL で確認できるようにする。"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <code className="rounded-full border border-line bg-surface-strong px-4 py-2 text-sm">
            /c/demo-shop
          </code>
          <Link
            className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white"
            href="/c/demo-shop"
          >
            public preview
          </Link>
        </div>
      </SectionCard>
    </>
  );
}
