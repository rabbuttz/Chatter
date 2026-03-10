import { intakeCategories, sellerTypes, setupSteps } from "@ichijiuke/domain";
import { SectionCard, StatusBadge } from "@ichijiuke/ui";

export default function SetupPage() {
  return (
    <>
      <SectionCard
        eyebrow="Setup Wizard"
        title="3〜5 分で公開まで進める"
        description="shop type と category policy を先に決め、その結果を knowledge / notifications / publish に流す。"
      >
        <div className="flex flex-wrap gap-2">
          {setupSteps.map((step) => (
            <StatusBadge key={step} label={step} tone="neutral" />
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          eyebrow="Seller Type"
          title="運用モード"
          description="物販とデジタル商品の差分は UI ではなく契約側の切り替えで吸収する。"
        >
          <div className="grid gap-3">
            {sellerTypes.map((sellerType) => (
              <div key={sellerType.value} className="rounded-[24px] border border-line bg-surface-strong px-4 py-4">
                <p className="text-sm font-semibold">{sellerType.label}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{sellerType.description}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Policies"
          title="初期カテゴリ"
          description="MVP 中は category master を自由追加せず、handling と notify の切り替えだけを許可する。"
        >
          <div className="grid gap-3">
            {intakeCategories.map((category) => (
              <div key={category.code} className="rounded-[24px] border border-line bg-surface-strong px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold">{category.label}</p>
                  <StatusBadge label={category.defaultHandling} tone="accent" />
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{category.summary}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
