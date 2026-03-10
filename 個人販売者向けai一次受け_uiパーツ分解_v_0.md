# 個人販売者向けAI一次受け UIパーツ分解 v0.1

## 目的
既存の管理画面ワイヤーフレームを、画面ごとのUIパーツ単位まで分解し、以下に使える粒度に落とし込む。

- 画面設計
- React / Next.js実装
- デザイン作成
- コンポーネント設計
- 開発チケット分解

対象は以下の2タイプ。
- 物販販売者
- デジタル商品販売者（Booth等）

---

## 共通UIルール

### レイアウト共通
- PCでは左サイドナビ + 右コンテンツ
- モバイルでは上部ヘッダー + ハンバーガーメニュー
- メイン幅は読みやすい固定幅 + 一部画面はフル幅
- 主CTAは画面右上または各セクション末尾

### 共通コンポーネント
- AppHeader
- SideNav
- Breadcrumb
- PageHeader
- SectionCard
- InfoBanner
- StatusBadge
- PrimaryButton
- SecondaryButton
- DangerButton
- ToggleSwitch
- CheckboxRow
- RadioCard
- SelectBox
- Tag
- InputField
- TextAreaField
- HelpTooltip
- EmptyState
- Table
- Tabs
- Drawer / Modal
- PreviewPanel
- Toast

### 共通状態
- loading
- empty
- error
- saved
- unpublished
- published
- setup_incomplete

### 出し分け条件の基本
- sellerType = physical / digital / both
- planType = free / paid
- notificationLevel = summary / detailed / urgent_only

---

# 1. ログイン / 新規登録

## 1-1. ページ全体
### UIパーツ
- TopLogo
- HeaderNav
  - ログインリンク
  - 新規登録リンク
- HeroSection
- SignupFormCard
- AudienceIntroCard
- StepsPreviewCard

## 1-2. HeroSection
### 要素
- Headline
- Subheadline
- PrimaryCTA
- SecondaryCTA
- HeroIllustration placeholder

## 1-3. SignupFormCard
### 要素
- CardTitle
- EmailInput
- PasswordInput
- ShopNameInput
- SellerTypeQuickSelect
  - 物販
  - デジタル商品
  - 両方
- SubmitButton
- LoginLink
- TermsNote

### バリデーション
- メール形式
- パスワード文字数
- ショップ名必須

## 1-4. AudienceIntroCard
### 要素
- AudienceBadge x2
  - 物販向け
  - デジタル商品向け
- DescriptionText

## 1-5. StepsPreviewCard
### 要素
- StepItem x3
  - 受付内容を選ぶ
  - FAQ / 規約を登録する
  - URLを公開する

---

# 2. 初期セットアップウィザード

## 2-0. ページ全体
### UIパーツ
- WizardHeader
- StepProgressBar
- StepContentArea
- StickyFooterActionBar

### StickyFooterActionBar要素
- BackButton
- SaveDraftButton
- NextButton
- PublishButton（最終ステップのみ）

## 2-1. Step 1: ショップタイプ選択
### UIパーツ
- PageHeader
- SellerTypeCardGroup
- SellerTypeCard x3
- HelperText
- ExampleInfoBanner

### SellerTypeCard内部
- Icon
- Title
- Description
- ExampleText
- SelectedStateBorder

### 出し分け
- digital選択時は後続ステップでデジタル商品向け項目を追加表示
- both選択時は物販・デジタル両方の設定群を表示

## 2-2. Step 2: 受付内容選択
### UIパーツ
- SectionCard x3
  - 案内する内容
  - 受け付けない内容
  - 通知したい内容
- PresetSelectorBar
- CategoryCheckboxGrid
- SelectedSummaryPanel

### PresetSelectorBar要素
- PresetChip
  - かんたん販売向け
  - 受注販売向け
  - ハンドメイド向け
  - デジタル商品向け
  - 問い合わせ最小化重視
- ResetPresetButton

### CategoryCheckboxGrid要素
- GroupTitle
- CheckboxRow
- HelpTooltip
- RecommendedTag

### 物販カテゴリ項目
- 発送時期
- 送料
- 支払い方法
- サイズ・素材
- ギフト対応
- 返品・交換
- オーダー可否
- 不良品
- 誤配送
- 未着

### デジタル商品カテゴリ項目
- ダウンロード方法
- 対応環境
- 商用利用可否
- 利用範囲
- 再配布・転載は禁止
- アップデート予定
- ファイル破損
- ダウンロード不可
- 購入後トラブル
- ライセンス相談

### SelectedSummaryPanel要素
- SummaryTitle
- IncludedTags
- ExcludedTags
- NotifyTags

## 2-3. Step 3: FAQ / 規約登録
### UIパーツ
- InputMethodSwitcher
  - 手入力
  - テンプレートから始める
  - 後で追加する
- FAQEditorCard
- PolicyEditorCard
- GeneratedPreviewCard

### FAQEditorCard要素
- CardTitle
- FAQList
- AddFAQButton
- FAQItemEditor
  - QuestionInput
  - AnswerTextArea
  - CategorySelect
  - VisibilityToggle
  - DeleteButton

### PolicyEditorCard要素
- PolicySectionAccordion
- PolicyTextArea
- ApplyTemplateButton
- UseSampleTextLink

### 物販ポリシー項目
- 返品・交換
- キャンセル
- 配送
- 支払い
- 注意事項

### デジタル商品ポリシー項目
- ダウンロード案内
- 対応環境
- 利用規約
- 商用利用条件
- 二次配布禁止
- 返金ポリシー
- サポート範囲

### GeneratedPreviewCard要素
- PreviewTitle
- ExampleQuestion
- ExampleAnswer
- SourceBadge
  - FAQ
  - 規約
  - 対応範囲外

## 2-4. Step 4: 通知設定
### UIパーツ
- NotificationPolicyCard
- NotificationChannelCard
- NotificationPreviewCard

### NotificationPolicyCard要素
- ToggleRow x4
  - 要約して通知する
  - 高リスクは即時通知する
  - 暴言・スパムは通知しない
  - 規約記載済みは通知しない
- HelpNote

### NotificationChannelCard要素
- ChannelCheckbox
  - メール
  - ダッシュボード
- FutureIntegrationNote

### NotificationPreviewCard要素
- PreviewTabs
  - 通常通知
  - 高リスク通知
- NotificationSampleCard

## 2-5. Step 5: 公開
### UIパーツ
- PublishStatusCard
- PublicURLCard
- QRCodeCard
- ChatPreviewCard
- FinalChecklistCard

### PublicURLCard要素
- URLField
- CopyButton
- RegenerateButton
- OpenPreviewButton

### ChatPreviewCard要素
- ChatHeaderPreview
- GreetingMessagePreview
- CategoryButtonsPreview
- SampleConversation

### FinalChecklistCard要素
- ChecklistItem x4
  - FAQ登録済み
  - 規約設定済み
  - 通知設定済み
  - 公開メッセージ確認済み
- PublishButton

---

# 3. ダッシュボード

## 3-0. ページ全体
### UIパーツ
- PageHeader
- KPIGrid
- MainColumn
- SideColumn

## 3-1. PageHeader
### 要素
- PageTitle
- ShopStatusBadge
- PublishActionButton
- OpenChatButton
- CopyURLButton

## 3-2. KPIGrid
### UIパーツ
- KPICard x5
  - 総件数
  - 自動完結率
  - 規約誘導件数
  - 通知件数
  - 高リスク件数

### KPICard要素
- KPIIcon
- KPILabel
- KPIValue
- KPITrendText

## 3-3. 公開状況カード
### 要素
- CardTitle
- StatusBadge
- PublicURLField
- CopyButton
- OpenButton
- LastUpdatedText

## 3-4. 最近の通知カード
### 要素
- CardTitle
- NotificationList
- NotificationItem
  - CategoryTag
  - UrgencyBadge
  - SummaryText
  - TimeText
- ViewAllLink

## 3-5. 設定状況カード
### 要素
- CompletionMeter
- SetupChecklist
  - FAQ登録数
  - 規約設定完了度
  - 受付設定完了度
  - 公開設定完了度
- FixNowLink

## 3-6. 改善提案カード
### 要素
- SuggestionItemList
- SuggestionItem
  - SuggestionText
  - ActionLink

### デジタル商品向け追加提案例
- ダウンロード手順をFAQに追加
- 対応環境の表記を明確化
- 利用規約の要点を開始文に表示

---

# 4. 受付内容設定

## 4-0. ページ全体
### UIパーツ
- PageHeader
- SettingsTabs
- PolicyMatrixCard
- QuickButtonsCard
- ScopeMessageCard

## 4-1. PageHeader
### 要素
- Title
- Description
- SaveButton
- UsePresetButton

## 4-2. SettingsTabs
### タブ
- 共通
- 物販
- デジタル商品

## 4-3. PolicyMatrixCard
### UIパーツ
- CategoryPolicyTable
- InlineEditRow
- BulkActionBar

### CategoryPolicyTable列
- カテゴリ名
- 受け付ける
- AI回答
- 規約案内
- 要約通知
- 即時通知
- 記録のみ
- 推奨設定表示

### 行アクション
- RowToggle
- RowHelpTooltip
- ResetToDefaultLink

### 物販カテゴリ行
- 発送時期
- 送料
- 返品・交換
- サイズ・素材
- 不良品
- 誤配送
- 未着
- オーダー相談

### デジタル商品カテゴリ行
- ダウンロード方法
- 対応環境
- 商用利用可否
- 再配布可否
- 返金可否
- ファイル破損
- ダウンロード不可
- 利用規約違反相談

## 4-4. QuickButtonsCard
### UIパーツ
- DraggableButtonList
- AddButtonInput
- PreviewArea

### デフォルト候補（物販）
- 発送・お届け
- 返品・交換
- 商品について
- 注文トラブル
- オーダー相談
- その他

### デフォルト候補（デジタル）
- ダウンロードについて
- 対応環境について
- 利用規約について
- 購入後トラブル
- 商用利用について
- その他

## 4-5. ScopeMessageCard
### UIパーツ
- EditableMessageField x3
  - ご案内できること
  - 販売者確認が必要なこと
  - 受け付けていないこと
- AutoGenerateButton
- LivePreviewPanel

---

# 5. FAQ / 規約設定

## 5-0. ページ全体
### UIパーツ
- PageHeader
- Tabs
- FAQTableCard
- PolicySectionsCard
- TemplateLibraryDrawer
- PreviewCard

## 5-1. FAQタブ
### UIパーツ
- FAQToolbar
- FAQTable
- FAQEditorModal

### FAQToolbar要素
- SearchInput
- CategoryFilter
- AddFAQButton
- ImportButton（将来）

### FAQTable列
- 質問
- カテゴリ
- 公開状態
- 最終更新日
- 操作

### FAQEditorModal要素
- QuestionInput
- AnswerTextArea
- CategorySelect
- VisibilityToggle
- SaveButton
- DeleteButton

## 5-2. 規約タブ
### UIパーツ
- PolicyAccordionList
- PolicyEditorPane
- HelperExamplesPanel

### PolicyAccordionList項目（物販）
- 返品・交換
- キャンセル
- 配送
- 支払い
- 注意事項

### PolicyAccordionList項目（デジタル）
- ダウンロード商品の性質
- 対応環境
- 利用許諾
- 商用利用条件
- 二次配布・転載は禁止
- 改変可否
- 返金不可条件
- サポート範囲

## 5-3. テンプレートタブ
### UIパーツ
- TemplateCategoryTabs
- TemplateGrid
- TemplatePreviewModal

### テンプレート種類
- ハンドメイド向け
- 受注販売向け
- Booth向け
- イラスト素材向け
- 音源素材向け
- 同人DL作品向け

## 5-4. プレビュータブ
### UIパーツ
- QuestionSimulator
- AnswerPreview
- SourceReferencePills

### 例示質問
- 返品できますか
- ダウンロード方法を教えてください
- 商用利用できますか
- 商品が届きません

---

# 6. 商品・販売情報設定

## 6-0. ページ全体
### UIパーツ
- PageHeader
- BasicInfoCard
- ProductListCard
- SalesChannelsCard

## 6-1. BasicInfoCard
### 要素
- ShopNameInput
- ShopDescriptionTextArea
- BusinessHoursInput
- InquiryPolicyTextArea
- SaveButton

## 6-2. ProductListCard
### UIパーツ
- ProductToolbar
- ProductTable
- ProductEditorDrawer

### ProductToolbar要素
- SearchInput
- ProductTypeFilter
- AddProductButton

### ProductTable共通列
- 商品名
- 商品タイプ
- ステータス
- 最終更新
- 操作

### ProductEditorDrawer共通要素
- ProductNameInput
- ProductCategorySelect
- DescriptionTextArea
- TagInput
- SaveButton

### 物販用追加フィールド
- サイズ
- 素材
- バリエーション
- 発送目安

### デジタル商品用追加フィールド
- 商品タイプ
  - PDF
  - 画像素材
  - 3Dモデル
  - 音源
  - テンプレート
  - アセット
- 対応環境
- ファイル形式
- ダウンロード方法
- ライセンス区分
- アップデート予定
- サポート対象外事項

## 6-3. SalesChannelsCard
### UIパーツ
- ChannelCardGrid
- ChannelCard
- CustomURLInput

### ChannelCard項目
- Shopify
- BASE
- STORES
- Booth
- Gumroad
- その他

### Booth選択時追加UI
- BoothShopURLInput
- BoothProductURLInput
- DescriptionPasteArea
- NotesPasteArea
- ReflectButton

---

# 7. 通知設定

## 7-0. ページ全体
### UIパーツ
- PageHeader
- PolicyCard
- DestinationsCard
- FormatCard
- DigitalRulesCard

## 7-1. PolicyCard
### 要素
- ToggleRow
  - 要約通知
  - 原文を隠す
  - 高リスク優先通知
  - 規約済み通知オフ
- SaveButton

## 7-2. DestinationsCard
### 要素
- EmailInputList
- DashboardOnlyToggle
- AddDestinationButton（将来）

## 7-3. FormatCard
### 要素
- RadioGroup
  - 1行要約
  - 詳細要約
  - 原文も表示
- NotificationPreviewSample

## 7-4. DigitalRulesCard
### 表示条件
- sellerType = digital or both

### 要素
- ToggleRow
  - ダウンロード不可は通知
  - ファイル破損は通知
  - 利用違反相談は優先通知
  - 環境依存質問は通知しない
- HelpNote

---

# 8. 公開URL / チャット公開設定

## 8-0. ページ全体
### UIパーツ
- PageHeader
- PublicURLCard
- AppearanceCard
- ScopeDisplayCard
- StarterButtonsCard
- ChatPagePreview

## 8-1. PublicURLCard
### 要素
- URLInputReadOnly
- CopyButton
- RegenerateButton
- QRCodePanel
- OpenLinkButton

## 8-2. AppearanceCard
### 要素
- ChatTitleInput
- IconUploader
- IntroTextArea
- OpeningMessageTextArea

## 8-3. ScopeDisplayCard
### 要素
- InfoTextArea x3
  - ご案内できること
  - 販売者確認が必要なこと
  - 受け付けないこと
- VisibilityToggle
- PreviewBox

## 8-4. StarterButtonsCard
### 要素
- StarterButtonsToggle
- SortableButtonList
- AddCustomButtonField
- ButtonPreview

## 8-5. ChatPagePreview
### 要素
- SimulatedMobileFrame
- HeaderPreview
- ScopePreview
- ButtonPreviewList
- MessageComposerPreview

---

# 9. チャット履歴 / 引き継ぎ一覧

## 9-0. ページ全体
### UIパーツ
- PageHeader
- Tabs
- FilterBar
- SummaryTable
- DetailDrawer

## 9-1. FilterBar
### 要素
- SearchInput
- CategoryFilter
- UrgencyFilter
- StatusFilter
- DateRangePicker

## 9-2. SummaryTable
### 列
- 受信日時
- カテゴリ
- 緊急度
- 一行要約
- ステータス
- 操作

### 行スタイル
- 高リスクは強調色
- 未確認は太字

## 9-3. DetailDrawer
### 上部サマリー
- CategoryTag
- UrgencyBadge
- SummaryText
- RequestTypeField
- RecommendedActionField

### 中部
- AIResponsePanel
- UserOriginalTextPanel
- ReferencedPoliciesPanel

### 下部アクション
- ConfirmedButton
- NoActionNeededButton
- ShowOriginalToggle

### 注意
- デフォルトは原文折りたたみ
- 高リスクのみ原文即表示可オプション

---

# 10. テンプレート / 返信トーン設定

## 10-0. ページ全体
### UIパーツ
- PageHeader
- ToneSelectorCard
- TemplatesListCard
- PreviewCard

## 10-1. ToneSelectorCard
### 要素
- RadioCardGroup
  - 丁寧
  - 親しみやすい
  - 事務的
  - やわらかい
- ToneDescription

## 10-2. TemplatesListCard
### UIパーツ
- TemplateSection x5
  - 自動回答
  - 規約案内
  - 対応範囲外
  - 引き継ぎ
  - 境界線提示

### 各TemplateSection要素
- TemplateName
- TextArea
- ResetLink
- VariableHint
  - {要点}
  - {該当ページ名}
  - {対象内容}

### デジタル商品向け追加テンプレート
- ダウンロード商品につき返品不可
- 対応環境の確認依頼
- 利用許諾の案内
- 再配布禁止の案内

## 10-3. PreviewCard
### 要素
- ScenarioSelect
- UserMessagePreview
- BotReplyPreview

---

# 11. プラン / アカウント設定

## 11-0. ページ全体
### UIパーツ
- PlanStatusCard
- UsageCard
- TeamCard
- BillingCard
- DangerZoneCard

## 11-1. PlanStatusCard
### 要素
- CurrentPlanBadge
- PlanDescription
- UpgradeButton

## 11-2. UsageCard
### 要素
- MonthlyUsageMeter
- ChatCountText
- URLCountText

## 11-3. TeamCard
### 要素
- MemberList
- InviteButton

## 11-4. BillingCard
### 要素
- BillingInfoSummary
- UpdateBillingButton

## 11-5. DangerZoneCard
### 要素
- DeleteAccountButton
- WarningText

---

# 画面間で再利用するコンポーネント一覧

## 高頻度再利用
- SectionCard
- ToggleRow
- CheckboxRow
- PolicyTable
- URLCopyField
- LivePreviewPanel
- SummaryTagList
- NotificationSampleCard
- FAQEditorModal
- ProductEditorDrawer

## 物販・デジタル切り替えに使うコンポーネント
- SellerTypeSwitch
- ConditionalSection
- DigitalPolicyFields
- PhysicalPolicyFields
- StarterButtonsPreset

---

# 実装優先度の高いコンポーネント

## MVP必須
- StepProgressBar
- SellerTypeCardGroup
- CategoryCheckboxGrid
- FAQItemEditor
- PolicyAccordionList
- PublicURLCard
- KPIGrid
- NotificationList
- CategoryPolicyTable
- SummaryTable
- DetailDrawer

## 後回し可能
- QRCodeCard
- TemplatePreviewModal
- SuggestionItemList
- TeamCard
- BillingCard

---

# フロント実装の切り方

## レベル1: ページ
- /signup
- /setup
- /dashboard
- /settings/intake
- /settings/faq
- /settings/products
- /settings/notifications
- /settings/publish
- /inbox
- /settings/templates
- /settings/account

## レベル2: セクション
- SetupSellerTypeSection
- SetupIntakeSection
- SetupPolicySection
- DashboardStatsSection
- IntakePolicyMatrixSection
- FAQTableSection
- PublishPreviewSection
- InboxListSection

## レベル3: コンポーネント
- SellerTypeCard
- FAQRowEditor
- PolicyTextEditor
- ChannelCard
- NotificationRuleToggle
- StarterButtonItem
- InquirySummaryRow

---

# 一言の分解方針

画面ごとに全部作るのではなく、\n「受付設定」「根拠情報登録」「通知」「公開」「確認」の5つの体験単位でコンポーネント化する。

