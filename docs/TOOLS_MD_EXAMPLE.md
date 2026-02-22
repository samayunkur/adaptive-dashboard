# TOOLS.md 追加内容

以下の内容を `~/.openclaw/workspace/TOOLS.md` に追加してください。

```markdown
## Adaptive Dashboard

パーソナルダッシュボード。会話からデータを自動更新。

- **プロジェクトパス**: `/home/developer/projects/adaptive-dashboard`
- **dev server**: `http://localhost:3000`
- **データディレクトリ**: `data/`

### 起動確認

作業前に開発サーバーが起動しているか確認：

\`\`\`bash
cd /home/developer/projects/adaptive-dashboard
pnpm dev
\`\`\`

### 会話からの自動更新

ユーザーが日常の出来事・目標・記録を話したら、適切なデータファイルを更新：

| ユーザーの発言 | アクション |
|------------|--------|
| 「今日は〜した」 | `data/diary/YYYY-MM.md` に追記 |
| 「〜km走った」 | `data/counters.json` 更新 + `data/activity.json` 追加 |
| 「体重〜kg」 | `data/charts/weight.json` に追加（ウィジェットがあれば） |
| 「〜を追加して」 | `data/layout.json` に新しいウィジェット追加 |
| 「〜を大きく」 | `data/layout.json` でサイズ変更 |

### データファイル構造

- `data/layout.json` - ウィジェット配置定義
- `data/diary/YYYY-MM.md` - 月ごとの日記（Markdown）
- `data/counters.json` - カウンター値
- `data/activity.json` - アクティビティログ（GitHub grass風）
- `data/charts/*.json` - チャートデータ

### 操作例

#### 日記追記

\`\`\`typescript
const today = '2026-02-22';
const diaryPath = 'data/diary/2026-02.md';
const content = await Read(diaryPath);
await Edit({
  path: diaryPath,
  oldText: content,
  newText: content + `\\n\\n## ${today}\\n今日は自転車で50km走った。\\n`
});
\`\`\`

#### カウンター更新

\`\`\`typescript
const countersJson = await Read('data/counters.json');
const counters = JSON.parse(countersJson);
counters.bike_km_feb = {
  value: (counters.bike_km_feb?.value || 0) + 50,
  updatedAt: '2026-02-22'
};
await Write({
  path: 'data/counters.json',
  content: JSON.stringify(counters, null, 2)
});
\`\`\`

#### ウィジェット追加

\`\`\`typescript
const layoutJson = await Read('data/layout.json');
const layout = JSON.parse(layoutJson);
layout.widgets.push({
  id: 'new-widget',
  type: 'counter',
  position: { x: 6, y: 3 },
  size: { w: 3, h: 2 },
  config: { title: '新しいカウンター', dataPath: 'data/counters.json', key: 'new_key' }
});
await Write({
  path: 'data/layout.json',
  content: JSON.stringify(layout, null, 2)
});
\`\`\`

### 注意事項

- **JSON整合性**: 必ず `JSON.parse()` でバリデーション
- **既存データ保護**: Read → 変更 → Write の流れを守る
- **グリッド理解**: 12列グリッド、ウィジェットが重ならないように配置

詳細: `/home/developer/projects/adaptive-dashboard/docs/AGENT_GUIDE.md`
```
