import {
  createDefaultSellerPolicies,
  intakeCategories,
  intakeCategoryByCode,
  type AutoReplyTone,
  type HandlingMode,
  type InquiryStatus,
  type KnowledgeSource,
  type NotificationMode,
  type SellerPolicy,
  type SellerType,
} from "@ichijiuke/domain";

export type InquiryPreview = {
  message: string;
  categoryCode: string;
  categoryLabel: string;
  urgency: "normal" | "summary" | "urgent";
  actionLabel: string;
  suggestedReply: string;
};

export type InquiryEngineInput = {
  message: string;
  sellerType: SellerType;
  policies: SellerPolicy[];
  knowledgeSources: KnowledgeSource[];
  tone?: AutoReplyTone;
};

export type InquiryEngineResult = {
  categoryCode: string;
  categoryLabel: string;
  handlingMode: HandlingMode;
  notificationMode: NotificationMode;
  inquiryStatus: InquiryStatus;
  reply: string;
  summary: string;
  headline: string;
  suggestedAction: string;
  matchedSourceIds: string[];
  matchedSourceTitles: string[];
};

type Rule = {
  categoryCode: string;
  priority: number;
  keywords: string[];
};

const rules: Rule[] = [
  {
    categoryCode: "C13",
    priority: 100,
    keywords: [
      "決済",
      "カード",
      "クレジット",
      "支払いエラー",
      "二重請求",
      "返金",
      "個人情報",
      "住所",
      "電話番号",
      "漏えい",
    ],
  },
  {
    categoryCode: "C14",
    priority: 95,
    keywords: [
      "法的",
      "法律",
      "弁護士",
      "訴訟",
      "違法",
      "著作権",
      "安全",
      "危険",
      "事故",
      "怪我",
    ],
  },
  {
    categoryCode: "C09",
    priority: 88,
    keywords: ["破損", "壊れ", "不良", "欠品", "割れ", "傷"],
  },
  {
    categoryCode: "C08",
    priority: 84,
    keywords: ["未着", "届か", "追跡", "誤配送", "発送されたのに", "紛失"],
  },
  {
    categoryCode: "C10",
    priority: 78,
    keywords: ["説明と違", "違う", "苦情", "クレーム", "不満", "納得でき"],
  },
  {
    categoryCode: "C07",
    priority: 70,
    keywords: ["オーダー", "見積", "例外", "相談", "特注", "大量注文"],
  },
  {
    categoryCode: "C03",
    priority: 62,
    keywords: ["返品", "交換", "キャンセル", "支払い方法", "返金条件"],
  },
  {
    categoryCode: "C04",
    priority: 60,
    keywords: ["商用利用", "利用規約", "ライセンス", "再配布", "改変", "禁止事項"],
  },
  {
    categoryCode: "C01",
    priority: 55,
    keywords: ["発送", "お届け", "送料", "配送", "営業日", "納期"],
  },
  {
    categoryCode: "C02",
    priority: 52,
    keywords: ["サイズ", "素材", "仕様", "使い方", "対応環境", "ダウンロード", "ファイル形式"],
  },
  {
    categoryCode: "C05",
    priority: 44,
    keywords: ["値下げ", "割引", "無料", "例外対応", "特別扱い", "交渉"],
  },
  {
    categoryCode: "C11",
    priority: 24,
    keywords: ["広告", "営業", "seo", "副業", "宣伝", "dmください"],
  },
  {
    categoryCode: "C12",
    priority: 20,
    keywords: ["バカ", "最悪", "ふざけ", "死ね", "詐欺", "むかつく"],
  },
];

const toneOpeners: Record<AutoReplyTone, string> = {
  neutral: "お問い合わせありがとうございます。",
  warm: "ご連絡ありがとうございます。状況が分かるよう整理してご案内します。",
  firm: "ご連絡ありがとうございます。確認が必要な点を明確にしてご案内します。",
};

const demoKnowledge: KnowledgeSource[] = [
  {
    id: "demo-faq-shipping",
    sellerId: "demo-seller",
    type: "faq",
    status: "published",
    title: "発送目安",
    body: "通常は3営業日以内に発送します。追跡番号は発送完了後に共有します。",
    tags: ["発送", "配送", "営業日"],
    sellerTypes: ["physical", "hybrid"],
    sortOrder: 0,
  },
  {
    id: "demo-policy-returns",
    sellerId: "demo-seller",
    type: "policy",
    status: "published",
    title: "返品・キャンセル規約",
    body: "不良品を除き、購入者都合の返品とキャンセルは受け付けません。",
    tags: ["返品", "キャンセル", "交換"],
    sellerTypes: ["physical", "digital", "hybrid"],
    sortOrder: 1,
  },
  {
    id: "demo-product-license",
    sellerId: "demo-seller",
    type: "product",
    status: "published",
    title: "デジタル商品の利用条件",
    body: "商用利用可否、再配布禁止、改変範囲は商品ごとに記載しています。",
    tags: ["商用利用", "ライセンス", "再配布"],
    sellerTypes: ["digital", "hybrid"],
    sortOrder: 2,
  },
  {
    id: "demo-business-scope",
    sellerId: "demo-seller",
    type: "business",
    status: "published",
    title: "窓口の対応範囲",
    body: "発送、返品ルール、商品情報は案内できます。個別交渉や法的判断は受け付けません。",
    tags: ["対応範囲", "発送", "返品", "商品情報"],
    sellerTypes: ["physical", "digital", "hybrid"],
    sortOrder: 3,
  },
];

function normalizeText(value: string) {
  return value.toLowerCase().replaceAll(/\s+/g, "");
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function shortMessage(value: string, limit = 72) {
  const trimmed = value.trim();

  if (trimmed.length <= limit) {
    return trimmed;
  }

  return `${trimmed.slice(0, limit - 1)}…`;
}

function matchKnowledgeSources(
  message: string,
  knowledgeSources: KnowledgeSource[],
) {
  const normalized = normalizeText(message);

  return knowledgeSources
    .filter((source) => source.status === "published")
    .map((source) => {
      const haystack = normalizeText(
        [source.title, source.body, ...source.tags].join(" "),
      );
      const matches = unique(
        source.tags.filter((tag) => normalized.includes(normalizeText(tag))),
      );
      const titleMatched = normalized.includes(normalizeText(source.title));
      const bodyMatched =
        !titleMatched &&
        unique(
          source.body
            .split(/[、。\s,]/)
            .map((token) => token.trim())
            .filter((token) => token.length >= 2 && normalized.includes(normalizeText(token))),
        ).length > 0;

      return {
        source,
        score: matches.length * 3 + Number(titleMatched) * 2 + Number(bodyMatched),
        hits: matches,
        haystack,
      };
    })
    .filter((item) => item.score > 0 || rules.some((rule) => item.hits.some((hit) => rule.keywords.includes(hit))))
    .sort((left, right) => right.score - left.score);
}

function detectCategory(
  message: string,
  sellerType: SellerType,
  knowledgeSources: KnowledgeSource[],
) {
  const normalized = normalizeText(message);
  const knowledgeMatches = matchKnowledgeSources(message, knowledgeSources);
  const scoredRules = rules
    .map((rule) => ({
      rule,
      score: rule.priority + rule.keywords.filter((keyword) => normalized.includes(normalizeText(keyword))).length * 4,
    }))
    .filter((item) => item.score > item.rule.priority);

  if (scoredRules.length > 0) {
    scoredRules.sort((left, right) => right.score - left.score);

    return {
      categoryCode: scoredRules[0]?.rule.categoryCode ?? "C15",
      knowledgeMatches,
    };
  }

  const topKnowledge = knowledgeMatches[0]?.source;

  if (topKnowledge?.type === "policy") {
    return {
      categoryCode: sellerType === "digital" ? "C04" : "C03",
      knowledgeMatches,
    };
  }

  if (topKnowledge?.type === "faq" || topKnowledge?.type === "product") {
    return {
      categoryCode: topKnowledge.type === "faq" ? "C01" : "C02",
      knowledgeMatches,
    };
  }

  return {
    categoryCode: normalized.length < 10 ? "C15" : "C06",
    knowledgeMatches,
  };
}

function resolvePolicy(
  categoryCode: string,
  policies: SellerPolicy[],
) {
  return policies.find((policy) => policy.categoryCode === categoryCode);
}

function resolveHandling(
  categoryCode: string,
  policies: SellerPolicy[],
) {
  const category = intakeCategoryByCode[categoryCode] ?? intakeCategories[intakeCategories.length - 1];
  const policy = resolvePolicy(categoryCode, policies);

  if (category.isHighRisk) {
    return {
      handlingMode: "urgent_handoff" as const,
      notificationMode: "urgent" as const,
    };
  }

  if (!policy || !policy.isEnabled) {
    return {
      handlingMode: category.defaultHandling,
      notificationMode: category.notificationMode,
    };
  }

  return {
    handlingMode: policy.handlingMode,
    notificationMode: policy.notificationMode,
  };
}

function resolveStatus(handlingMode: HandlingMode): InquiryStatus {
  if (handlingMode === "urgent_handoff") {
    return "urgent_review";
  }

  if (handlingMode === "handoff") {
    return "handoff_required";
  }

  return "auto_closed";
}

function toActionLabel(handlingMode: HandlingMode, notificationMode: NotificationMode) {
  if (notificationMode === "urgent") {
    return "即時通知";
  }

  if (handlingMode === "handoff") {
    return "販売者確認";
  }

  if (handlingMode === "policy_redirect") {
    return "規約案内";
  }

  if (handlingMode === "reject") {
    return "受付範囲外";
  }

  if (handlingMode === "log_only") {
    return "記録のみ";
  }

  if (notificationMode === "summary") {
    return "要約通知";
  }

  return "自動回答";
}

function composeReply(
  categoryCode: string,
  tone: AutoReplyTone,
  matchedSourceTitles: string[],
  handlingMode: HandlingMode,
) {
  const category = intakeCategoryByCode[categoryCode] ?? intakeCategories[intakeCategories.length - 1];
  const referenceText =
    matchedSourceTitles.length > 0
      ? ` 参照候補: ${matchedSourceTitles.join(" / ")}。`
      : "";

  if (handlingMode === "urgent_handoff") {
    return `${toneOpeners[tone]} 高リスクとして受け付けました。内容を整理して販売者へ優先共有します。${referenceText}`;
  }

  if (handlingMode === "handoff") {
    return `${toneOpeners[tone]} ${category.label} に関する個別確認が必要なため、要点をまとめて販売者へ引き継ぎます。${referenceText}`;
  }

  if (handlingMode === "policy_redirect") {
    return `${toneOpeners[tone]} この内容は登録済みのご案内・規約をもとに確認するのが適切です。要点を確認しやすい形で案内します。${referenceText}`;
  }

  if (handlingMode === "reject") {
    return `${toneOpeners[tone]} この窓口では ${category.label} に関する個別交渉や例外判断には対応していません。ショップの通常ルールをご確認ください。`;
  }

  if (handlingMode === "log_only") {
    return `${toneOpeners[tone]} この内容は記録のみ行い、個別対応は行いません。必要であれば状況を具体的に書き直してお送りください。`;
  }

  return `${toneOpeners[tone]} ${category.summary}${referenceText}`;
}

export function evaluateInquiry(
  input: InquiryEngineInput,
): InquiryEngineResult {
  const tone = input.tone ?? "neutral";
  const { categoryCode, knowledgeMatches } = detectCategory(
    input.message,
    input.sellerType,
    input.knowledgeSources,
  );
  const category = intakeCategoryByCode[categoryCode] ?? intakeCategories[intakeCategories.length - 1];
  const matchedSources = knowledgeMatches.slice(0, 3).map((item) => item.source);
  const matchedSourceIds = matchedSources.map((source) => source.id);
  const matchedSourceTitles = matchedSources.map((source) => source.title);
  const { handlingMode, notificationMode } = resolveHandling(
    category.code,
    input.policies,
  );
  const inquiryStatus = resolveStatus(handlingMode);
  const headline = `${category.label} を一次受け`;
  const suggestedAction = toActionLabel(handlingMode, notificationMode);
  const summary = `${category.summary} 問い合わせ要点: ${shortMessage(input.message, 56)}`;
  const reply = composeReply(
    category.code,
    tone,
    matchedSourceTitles,
    handlingMode,
  );

  return {
    categoryCode: category.code,
    categoryLabel: category.label,
    handlingMode,
    notificationMode,
    inquiryStatus,
    reply,
    summary,
    headline,
    suggestedAction,
    matchedSourceIds,
    matchedSourceTitles,
  };
}

function notificationModeToUrgency(mode: NotificationMode) {
  if (mode === "urgent") {
    return "urgent" as const;
  }

  if (mode === "summary") {
    return "summary" as const;
  }

  return "normal" as const;
}

export function buildInboxPreview(
  messages: string[],
  inputBase: Omit<InquiryEngineInput, "message">,
): InquiryPreview[] {
  return messages.map((message) => {
    const result = evaluateInquiry({
      ...inputBase,
      message,
    });

    return {
      message,
      categoryCode: result.categoryCode,
      categoryLabel: result.categoryLabel,
      urgency: notificationModeToUrgency(result.notificationMode),
      actionLabel: result.suggestedAction,
      suggestedReply: result.reply,
    };
  });
}

const demoInputBase: Omit<InquiryEngineInput, "message"> = {
  sellerType: "hybrid",
  policies: createDefaultSellerPolicies("hybrid"),
  knowledgeSources: demoKnowledge,
  tone: "warm",
};

export function simulateInquiry(message: string): InquiryPreview {
  return buildInboxPreview([message], demoInputBase)[0];
}

export const inboxPreview = buildInboxPreview(
  [
    "返品したいのですが、条件を教えてください",
    "荷物がまだ届いていません",
    "決済エラーで二重請求のように見えます",
  ],
  demoInputBase,
);
