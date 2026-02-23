# Adaptive Dashboard

OpenClawエージェントが会話に応じて動的に構築・編集するパーソナルダッシュボード。

## 特徴

- 🤖 **エージェント駆動**: OpenClawエージェントが会話から自動でダッシュボードを更新
- 📊 **プリセットウィジェット**: 7種類の事前定義ウィジェット（日記、ヒートマップ、カウンターなど）
- 📁 **Git管理可能**: すべてのデータはJSON/Markdown形式で保存
- 🎨 **一貫性のあるUI**: Tailwind CSS + Next.js 15で構築
- 🔄 **リアルタイム更新**: ファイル変更で自動リロード
- 🎯 **ドラッグ&ドロップ**: 編集モードでウィジェットを自由に配置・リサイズ
- 🌓 **ダークモード**: ワンクリックでテーマ切り替え
- 📱 **レスポンシブ対応**: 画面サイズに応じて最適化

## セットアップ

### 1. インストール

```bash
git clone https://github.com/your-username/adaptive-dashboard.git
cd adaptive-dashboard
pnpm install
```

### 2. 開発サーバー起動

```bash
pnpm dev
```

ブラウザで http://localhost:3000 を開く。

### 3. ウィジェットの配置編集（オプション）

ブラウザで「編集モード」ボタンをクリックすると、ウィジェットをドラッグ&ドロップで移動・リサイズできます。

1. 右上の「編集モード」ボタンをクリック
2. ウィジェットをドラッグして移動、コーナーをドラッグしてリサイズ
3. 「保存」ボタンをクリックしてレイアウトを保存

## OpenClawとの連携

### TOOLS.mdに追加

OpenClawエージェントがダッシュボードを操作できるようにするため、`~/.openclaw/workspace/TOOLS.md` に以下を追加：

```markdown
### Adaptive Dashboard

- **プロジェクトパス**: `/home/developer/projects/adaptive-dashboard`
- **編集対象**: `data/layout.json`, `data/**/*.{json,md}`
- **dev server**: `http://localhost:3000`

#### 会話からの自動更新

ユーザーが日常の出来事・目標・記録を話したら：
1. 適切なデータファイルを特定
2. 該当ファイルを更新（日記追記、カウンター更新など）
3. 必要なら layout.json を調整

#### データ更新例

- 日記追記: `data/diary/YYYY-MM.md` に追記
- カウンター更新: `data/counters.json` の該当キーを更新
- アクティビティ記録: `data/activity.json` に追加
```

### 使用例

エージェントに以下のように依頼できます：

- 「今日は自転車で50km走った」→ 日記追記 + カウンター更新 + アクティビティ記録
- 「体重グラフを追加して」→ 新しいChartWidgetを配置
- 「走行距離のウィジェットを大きくして」→ layout.json でサイズ変更

## データ構造

### `data/layout.json`
ウィジェットの配置とサイズを定義。

```json
{
  "version": "1.0",
  "grid": { "columns": 12, "rowHeight": 100, "gap": 16 },
  "widgets": [
    {
      "id": "diary-main",
      "type": "diary",
      "position": { "x": 0, "y": 0 },
      "size": { "w": 6, "h": 3 },
      "config": { "title": "日記", "dataPath": "data/diary" }
    }
  ]
}
```

### `data/diary/YYYY-MM.md`
月ごとのMarkdown形式の日記。

### `data/counters.json`
カウンター値を保存。

```json
{
  "bike_km_feb": { "value": 160, "updatedAt": "2026-02-21" }
}
```

### `data/activity.json`
GitHub grass風のアクティビティデータ。

```json
{
  "activities": [
    { "date": "2026-02-21", "count": 15, "type": "commit" }
  ]
}
```

## ウィジェット一覧

### Phase 1 & 2 実装済み

- ✅ **DiaryWidget**: Markdown形式の日記表示
- ✅ **CounterWidget**: 数値カウンター
- ✅ **HeatmapWidget**: GitHub grass風ヒートマップ
- ✅ **MilestoneWidget**: マイルストーン進捗管理
- ✅ **ChartWidget**: グラフ表示（折れ線/棒/円）
- ✅ **TodoWidget**: TODO管理
- ✅ **MarkdownWidget**: 汎用Markdownレンダラー

### Phase 3 実装予定

- ⏳ **TimelineWidget**: タイムライン表示
- ⏳ **ImageGalleryWidget**: 画像ギャラリー

## 技術スタック

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS
- **グリッド**: react-grid-layout
- **チャート**: recharts (今後)
- **Markdown**: react-markdown
- **言語**: TypeScript

## 開発

### ディレクトリ構造

```
adaptive-dashboard/
├── app/               # Next.js App Router
├── components/        # Reactコンポーネント
│   └── widgets/      # ウィジェット
├── lib/              # ユーティリティ・型定義
└── data/             # データファイル（Git管理）
```

### 新しいウィジェットの追加

1. `components/widgets/YourWidget.tsx` を作成
2. `components/DashboardGrid.tsx` の `widgetComponents` に登録
3. `lib/types.ts` に型を追加（必要に応じて）

## ライセンス

MIT

## 作者

Created with ❤️ by OpenClaw Agent (クロア)
