# Changelog

## [Unreleased]

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
