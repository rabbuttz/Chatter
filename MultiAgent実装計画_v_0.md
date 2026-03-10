# MultiAgent実装計画 v0.1

## 目的

このリポジトリの仕様書を、約10人の実装者が衝突を最小化しながらMVPに落とし込むための分担計画を定義する。

前提:
- 現在は仕様書のみで、技術スタックは未固定
- MVPの必須範囲は仕様書 13章と分類ルール表の MVP 実装ルールを優先する
- 物販とデジタル商品は「共通カテゴリ + sellerType差分」で扱う

## 思考深度ポリシー

- リーダー: `xhigh` 相当の粒度で設計判断、依存整理、レビュー、統合を担当
- 実装者: `high` 相当の粒度で、自分の担当範囲を深めに詰めて実装する
- 分類、通知、高リスク判定は自由回答に寄せず、明示ルールを優先する
- 判断に迷う場合は UI より先に設定スキーマとカテゴリマスタを固定する

補足:
- この環境では実装者側に明示的な `xhigh` 指定よりも、担当境界を明確にして深く考えさせる運用のほうが効く
- `xhigh` が必要な統合判断はリーダーに残す

## MVP境界

MVPで必須:
- 販売者登録 / ログイン
- 初期セットアップウィザード
- 専用URL発行
- FAQ / 規約登録
- 問い合わせ分類
- AI応答
- 販売者向け要約通知
- 問い合わせ履歴保存
- 公開チャットページ

MVPでは後回し:
- 外部ECとの深い同期
- 自動返金判断
- リアルタイム在庫連携
- 高度な権限管理
- 通知チャネルの多拡張
- 商品情報のリッチ管理
- 返信トーンの細かいブランド最適化

## 体制

### リーダー

- 責務: 技術選定、スキーマ固定、カテゴリ/アクションマスタ固定、PR統合、横断レビュー
- 所有物: 全体設計、ブランチ戦略、レビュー基準、契約変更
- 禁止: 個別画面の細部実装に入り込みすぎない

### Worker 01: 契約と設定スキーマ

- 責務: `shop settings` の単一スキーマ、カテゴリマスタ、アクションマスタ、公開状態、通知モードを定義
- 所有境界: `domain/config`, `domain/catalog`, API contract
- 完了条件: 他ワーカーが参照する型・契約が固定されている

### Worker 02: 認証・テナント基盤

- 責務: 販売者登録、ログイン、ショップ単位の分離、公開URL所有権
- 所有境界: `auth`, `tenant`, `seller`, `public-url ownership`
- 依存: Worker 01 の設定スキーマ

### Worker 03: 管理画面シェルと共通UI

- 責務: `AppShell`, `PageHeader`, `Tabs`, `SectionCard`, `Drawer`, `Modal`, `Toast`, `Form primitives`
- 所有境界: `ui/primitives`, `ui/layout`, `ui/shared`
- 完了条件: 他画面担当がシェルと部品を再利用できる

### Worker 04: 初期セットアップウィザード

- 責務: sellerType 選択、受付内容選択、FAQ/規約登録、通知設定、公開までの最短導線
- 所有境界: `features/setup`
- 依存: Worker 01, Worker 03
- 備考: Step 1-2 と Step 3-5 を内部で分割してもよい

### Worker 05: 受付内容設定

- 責務: カテゴリ別の処理方針、クイックボタン、受付範囲表示文
- 所有境界: `features/intake-settings`
- 依存: Worker 01, Worker 03, Worker 04
- 注意: カテゴリ定義の独自拡張は禁止

### Worker 06: 根拠情報管理

- 責務: FAQ、規約、商品基本情報、販売チャネル情報の CRUD
- 所有境界: `features/knowledge`, `features/products`
- 依存: Worker 01, Worker 03
- 備考: MVPでは FAQ / 規約を優先し、商品情報は最小項目に絞る

### Worker 07: 分類エンジンと応答制御

- 責務: `ScreeningEngine`, `KnowledgeMatchEngine`, `PriorityResolver`, `PolicyResolver`, `ReplyComposer`
- 所有境界: `domain/inquiry`, `domain/routing`, `domain/reply`
- 依存: Worker 01, Worker 06
- 注意: 高リスクカテゴリは販売者設定より優先

### Worker 08: 公開チャットと公開設定

- 責務: 専用URL、公開チャット画面、開始ボタン、受付範囲表示、公開設定
- 所有境界: `features/public-chat`, `features/publish-settings`
- 依存: Worker 01, Worker 03, Worker 04, Worker 07

### Worker 09: 通知・受信箱・履歴

- 責務: 要約通知、即時通知、履歴保存、引き継ぎ一覧、詳細表示
- 所有境界: `features/notifications`, `features/inbox`, `domain/history`
- 依存: Worker 01, Worker 07
- 注意: 通知ノイズ抑制を優先し、原文露出は最小限にする

### Worker 10: ダッシュボードと運用安全

- 責務: 公開状況、問い合わせ概要、最近の通知、設定完了度、監査ログ、失敗時フォールバック
- 所有境界: `features/dashboard`, `domain/analytics`, `domain/audit`
- 依存: Worker 01, Worker 07, Worker 09
- 備考: 改善提案の高度化は後回し

## 依存順

### Phase 0

- リーダーが技術スタック、フォルダ構成、DB 方針、API 方針を固定
- Worker 01, 02, 03 を先行着手

### Phase 1

- Worker 04, 05, 06, 07 を並列着手
- ただし Worker 05 と Worker 07 は Worker 01 のカテゴリ/アクション固定後に開始

### Phase 2

- Worker 08, 09 を着手
- 公開チャットは Worker 07 の最小分類結果を使って先につなぐ

### Phase 3

- Worker 10 が集計と監査を整備
- リーダーが横断テスト、導線確認、MVP境界の刈り込みを行う

## 競合しやすい箇所

- 受付カテゴリ定義
- 通知ルール
- 公開状態
- FAQ/規約とテンプレートの保存モデル
- 問い合わせステータス

対応方針:
- 上記はすべて Worker 01 の契約を唯一の参照元にする
- 各ワーカーは契約変更を直接マージせず、リーダー承認を必須にする

## Git運用

- `main`: 統合専用
- ブランチ命名: `w01-schema/*`, `w02-auth/*` のように担当番号を先頭に付ける
- 契約変更: `schema-change/*` として分離し、リーダーが吸収する
- 1ワーカー1責務を守り、他担当の所有境界を直接編集しない
- 共有部品の変更は Worker 03 経由で行う
- カテゴリ/通知/公開状態の変更は Worker 01 経由で行う

## 最初の着手順

1. リーダーが技術スタックを決める
2. Worker 01 が設定スキーマとカテゴリ/アクションを固定する
3. Worker 03 が管理画面シェルと共通UIを作る
4. Worker 02 が認証とテナント基盤を作る
5. Worker 04, 06, 07 が MVP の中核を並列で進める
6. Worker 05, 08, 09 で設定画面と公開導線をつなぐ
7. Worker 10 が可視化と監査を整える

## 現時点の判断

- 10人並列は可能
- ただし先に固定すべきなのは UI ではなく `設定スキーマ` と `カテゴリ/アクションマスタ`
- リーダーは `xhigh` 相当、実装者は `high` 相当で十分
- 実装開始前の唯一の未確定事項は技術スタック
