# エージェント操作ガイド

このドキュメントは、OpenClawエージェントがAdaptive Dashboardを操作するためのガイドです。

## 基本原則

1. **データファイルを直接編集する**（API経由ではなくファイルシステム）
2. **JSONは必ずバリデーションする**（不正なJSONは破損の原因）
3. **日記はMarkdownで追記**（既存コンテンツを破壊しない）
4. **layout.jsonの変更は慎重に**（グリッド構造を理解する）

---

## データファイル操作

### 1. 日記の追記

**ファイルパス**: `data/diary/YYYY-MM.md`

**操作**: 既存ファイルに新しいエントリを**先頭または末尾**に追加

**例**: ユーザーが「今日は自転車で50km走った」と言った場合

```bash
# 現在の年月を取得
CURRENT_MONTH=$(date +%Y-%m)
DIARY_PATH="/home/developer/projects/adaptive-dashboard/data/diary/${CURRENT_MONTH}.md"

# ファイルが存在しない場合は作成
if [ ! -f "$DIARY_PATH" ]; then
  echo "# ${CURRENT_MONTH}" > "$DIARY_PATH"
fi

# 新しいエントリを追記
DATE=$(date +%Y-%m-%d)
cat >> "$DIARY_PATH" << EOF

## ${DATE}
今日は自転車で50km走った。
EOF
```

または、Editツールを使って既存ファイルの末尾に追記：

```typescript
// Readで現在の内容を取得
const content = await Read('data/diary/2026-02.md');

// Editで追記
await Edit({
  path: 'data/diary/2026-02.md',
  oldText: content,
  newText: content + '\n\n## 2026-02-22\n今日は自転車で50km走った。\n'
});
```

---

### 2. カウンターの更新

**ファイルパス**: `data/counters.json`

**操作**: 既存のキーの値を更新、または新しいキーを追加

**例**: `bike_km_feb` を 50 に更新

```typescript
// 1. 現在の内容を読み込む
const countersJson = await Read('data/counters.json');
const counters = JSON.parse(countersJson);

// 2. 値を更新
counters.bike_km_feb = {
  value: 50,
  updatedAt: new Date().toISOString().split('T')[0]
};

// 3. 書き戻す
await Write({
  path: 'data/counters.json',
  content: JSON.stringify(counters, null, 2)
});
```

**注意**: 必ず既存の内容を読み込んでから変更すること（他のカウンターを消さないため）

---

### 3. アクティビティの追加

**ファイルパス**: `data/activity.json`

**操作**: `activities` 配列に新しいエントリを追加

**例**: 今日のコミット数とバイク走行距離を記録

```typescript
// 1. 現在の内容を読み込む
const activityJson = await Read('data/activity.json');
const activityData = JSON.parse(activityJson);

// 2. 新しいアクティビティを追加
const today = new Date().toISOString().split('T')[0];
activityData.activities.push(
  { date: today, count: 15, type: 'commit' },
  { date: today, count: 50, type: 'bike_km' }
);

// 3. 書き戻す
await Write({
  path: 'data/activity.json',
  content: JSON.stringify(activityData, null, 2)
});
```

---

### 4. ウィジェットの追加

**ファイルパス**: `data/layout.json`

**操作**: `widgets` 配列に新しいウィジェットを追加

**例**: 体重チャートウィジェットを追加

```typescript
// 1. layoutを読み込む
const layoutJson = await Read('data/layout.json');
const layout = JSON.parse(layoutJson);

// 2. 新しいウィジェットを追加
layout.widgets.push({
  id: 'weight-chart',
  type: 'chart',
  position: { x: 3, y: 3 },
  size: { w: 6, h: 2 },
  config: {
    title: '体重推移',
    dataPath: 'data/charts/weight.json',
    chartType: 'line'
  }
});

// 3. 書き戻す
await Write({
  path: 'data/layout.json',
  content: JSON.stringify(layout, null, 2)
});

// 4. チャートデータファイルも作成
await Write({
  path: 'data/charts/weight.json',
  content: JSON.stringify({
    type: 'line',
    title: '体重推移',
    data: [],
    yLabel: 'kg'
  }, null, 2)
});
```

---

### 5. ウィジェットのリサイズ・移動

**操作**: `layout.json` の該当ウィジェットの `size` または `position` を変更

**例**: `bike-counter` を大きくする

```typescript
const layoutJson = await Read('data/layout.json');
const layout = JSON.parse(layoutJson);

// 該当ウィジェットを検索
const widget = layout.widgets.find((w: any) => w.id === 'bike-counter');
if (widget) {
  widget.size = { w: 4, h: 2 }; // 元は { w: 3, h: 2 }
}

await Write({
  path: 'data/layout.json',
  content: JSON.stringify(layout, null, 2)
});
```

---

## 会話からの自動判定

ユーザーの発言を解析して、適切なアクションを選択する。

### パターン例

| ユーザーの発言 | アクション |
|------------|--------|
| 「今日は〜した」「今日は〜だった」 | 日記に追記 |
| 「〜km走った」「〜冊読んだ」 | カウンター更新 + activity追加 |
| 「〜を追加して」「〜も記録したい」 | 新しいウィジェット追加 |
| 「〜を大きく」「〜を目立たせて」 | ウィジェットリサイズ |
| 「〜を削除」 | ウィジェット削除 |

### 実装例

```typescript
async function handleUserMessage(message: string) {
  const today = new Date().toISOString().split('T')[0];
  
  // 自転車の距離を検出
  const bikeMatch = message.match(/(\d+)\s*km.*走/);
  if (bikeMatch) {
    const km = parseInt(bikeMatch[1]);
    
    // 1. 日記に追記
    await appendToDiary(today, `自転車で${km}km走った。`);
    
    // 2. カウンター更新
    await updateCounter('bike_km_feb', km);
    
    // 3. アクティビティ記録
    await addActivity({ date: today, count: km, type: 'bike_km' });
  }
  
  // 体重記録を検出
  const weightMatch = message.match(/体重.*?(\d+\.?\d*)\s*kg/);
  if (weightMatch) {
    const weight = parseFloat(weightMatch[1]);
    // チャートデータに追加
    await addChartData('weight.json', { date: today, value: weight });
  }
}
```

---

## 注意事項

### 1. JSONの整合性を保つ

- 必ず `JSON.parse()` でバリデーション
- 書き戻す前に `JSON.stringify()` でフォーマット
- インデントは2スペース（`JSON.stringify(data, null, 2)`）

### 2. ファイルの存在確認

- 新しいファイルを作成する前に、ディレクトリが存在するか確認
- `mkdir -p` で必要なディレクトリを作成

### 3. グリッドレイアウトの理解

- `columns`: 12（グリッドの列数）
- `position.x`: 0〜11（左端が0）
- `position.y`: 0〜∞（上から下へ）
- `size.w`: ウィジェットの幅（1〜12）
- `size.h`: ウィジェットの高さ（行数）

ウィジェットが重ならないように配置すること。

### 4. ウィジェットタイプ

現在実装済み:
- `diary`: 日記
- `counter`: カウンター
- `heatmap`: ヒートマップ

今後実装予定:
- `milestone`: マイルストーン
- `chart`: グラフ
- `todo`: TODO
- `markdown`: 汎用Markdown
- `timeline`: タイムライン
- `gallery`: 画像ギャラリー

---

## 完全な例：「今日は自転車で50km走った」

```typescript
const today = '2026-02-22';
const km = 50;

// 1. 日記に追記
const diaryPath = 'data/diary/2026-02.md';
const diaryContent = await Read(diaryPath);
await Edit({
  path: diaryPath,
  oldText: diaryContent,
  newText: diaryContent + `\n\n## ${today}\n今日は自転車で${km}km走った。\n`
});

// 2. カウンター更新
const countersJson = await Read('data/counters.json');
const counters = JSON.parse(countersJson);
const currentValue = counters.bike_km_feb?.value || 0;
counters.bike_km_feb = {
  value: currentValue + km,
  updatedAt: today
};
await Write({
  path: 'data/counters.json',
  content: JSON.stringify(counters, null, 2)
});

// 3. アクティビティ追加
const activityJson = await Read('data/activity.json');
const activityData = JSON.parse(activityJson);
activityData.activities.push({
  date: today,
  count: km,
  type: 'bike_km'
});
await Write({
  path: 'data/activity.json',
  content: JSON.stringify(activityData, null, 2)
});
```

---

## まとめ

- **Read → 変更 → Write** の流れを守る
- **JSON整合性**を常に確認
- **ユーザーの意図を解析**して適切なファイルを編集
- **グリッドレイアウト**を理解してウィジェット配置

このガイドに従えば、エージェントは安全かつ効果的にダッシュボードを操作できます。
