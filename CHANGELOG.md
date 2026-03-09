# Changelog

## [Unreleased]

### Phase 3.7 - 2025-02-23

#### Added
- **統合デプロイメント**: OpenClawと同じコンテナ内で動作する構成
  - supervisord設定追加
  - 1つのコンテナでOpenClaw + ダッシュボードを管理
  - ネットワーク設定不要、シンプルな構成
- **リアルタイム更新フック**: `lib/use-realtime.ts`追加
  - SWRを使用した3秒ごとの自動更新
  - カウンター、アクティビティ、TODO、マイルストーン用フック
- **OpenClaw統合ガイド**: 詳細な統合手順を文書化
  - 分離型（Dockerネットワーク使用）
  - 統合型（同じコンテナ内）

#### Changed
- API: GET /api/data でクエリパラメータ対応
- README.md: OpenClaw統合の説明を追加

### Phase 3.6 - 2025-02-23

#### Added
- **Docker対応**: 本格的なDockerデプロイメントサポート
  - Dockerfile（本番用マルチステージビルド）
  - Dockerfile.dev（開発用）
  - docker-compose.yml（開発・本番環境）
  - .dockerignore
- **環境変数サポート**: .env.example追加
  - NEXT_PUBLIC_API_URLで外部アクセス対応
  - 外部データベース接続設定
- **APIクライアント**: lib/api-client.ts追加
  - 環境変数からのURL自動取得
  - 統一的なAPI呼び出しヘルパー
- **standalone出力**: next.config.tsで有効化
- **ドキュメント更新**: Docker使用方法を追加

#### Changed
- README.md - Docker使用方法を追加（推奨方法に変更）
- docs/SETUP_GUIDE.md - Docker環境の詳細説明を追加
- next.config.ts - standalone出力とホスト設定を追加

### Phase 3.5 - 2025-02-23

#### Added
- **LowDB統合**: JSONファイルベースの軽量データベース導入
  - アトミック書き込みによる競合防止
  - インメモリキャッシュによる高速化
  - 型安全なデータアクセス
- **RESTful API**: `/api/data` エンドポイント
  - カウンター: update, increment, get
  - アクティビティ: add, get
  - マイルストーン: add, update, delete, get
  - TODO: add, toggle, delete, get
  - レイアウト: update, addWidget, removeWidget, get
- **日記API**: `/api/diary` エンドポイント
  - 日記の追記と取得

#### Changed
- `lib/db.ts` - LowDBラッパー実装
- `lib/data-loader.ts` - LowDB使用に変更
- README.md - LowDBを技術スタックに追加

### Phase 3 - 2026-02-23

#### Added
- **ダークモード切り替え**: next-themesを使用したテーマ切り替え機能
  - 右上のボタンでライト/ダークモード切り替え
  - システム設定に従う自動切り替えも対応
- **編集モード**: ウィジェットのドラッグ&ドロップ編集
  - 「編集モード」ボタンで編集モードに切り替え
  - ウィジェットの移動とリサイズが可能
  - 「保存」ボタンでレイアウトを永続化
- **レスポンシブ対応**: 画面サイズに応じてグリッド幅を動的調整
- API endpoint: `/api/layout` (POST) - レイアウト保存

#### Changed
- `app/page.tsx` - クライアントコンポーネント化、編集モード対応
- `components/DashboardGrid.tsx` - ドラッグ&ドロップ対応、レスポンシブ幅調整
- `app/layout.tsx` - ThemeProvider追加

### Phase 2 - 2026-02-22

#### Added
- **MilestoneWidget**: マイルストーン進捗管理（進捗バー、ステータスバッジ）
- **TodoWidget**: TODO管理（完了/未完了フィルター、完了率表示）
- **ChartWidget**: recharts使用（折れ線/棒/円グラフ対応）
- **MarkdownWidget**: 汎用Markdownファイル表示
- API routes: `/api/data?type=milestones|todos|chart|markdown`
- Agent helper functions: `lib/agent-helpers.ts`
  - `addWidget`, `updateWidget`, `removeWidget`, `resizeWidget`, `moveWidget`
  - `appendToDiary`, `updateCounter`, `incrementCounter`
  - `addActivity`, `addMilestone`, `updateMilestone`
  - `addTodo`, `toggleTodo`, `removeTodo`
  - `addChartData`
- Documentation:
  - `docs/QUICK_REFERENCE.md` - よくある操作パターン
  - `docs/AGENT_GUIDE.md` - エージェント詳細ガイド

#### Changed
- `data/layout.json` - 6つのウィジェットを配置（Phase 1: 3個 → Phase 2: 6個）
- README.md - ウィジェット一覧更新

### Phase 1 - 2026-02-21

#### Added
- **Next.js 15** プロジェクトセットアップ（App Router + TypeScript + Tailwind CSS）
- Core components:
  - `DashboardGrid.tsx` - react-grid-layoutベースのレイアウトエンジン
  - `WidgetWrapper.tsx` - 共通ウィジェットラッパー
- Widgets:
  - **DiaryWidget**: Markdown日記表示
  - **CounterWidget**: 数値カウンター（色・単位カスタマイズ可能）
  - **HeatmapWidget**: GitHub grass風アクティビティヒートマップ
- Data loaders: `lib/data-loader.ts`
- API endpoint: `/api/data`
- Sample data:
  - `data/diary/2026-02.md`
  - `data/counters.json`
  - `data/activity.json`
  - `data/layout.json`
- Documentation:
  - `README.md` - セットアップガイド
  - `docs/AGENT_GUIDE.md` - エージェント操作ガイド
  - `docs/TOOLS_MD_EXAMPLE.md` - TOOLS.md追加例
  - `docs/PROJECT_SUMMARY.md` - プロジェクトサマリー

## [0.1.0] - 2026-02-21

### Initial Release
- MVP実装完了
- 3つの基本ウィジェット
- Git管理可能なデータ構造
- OpenClawエージェント連携基盤
