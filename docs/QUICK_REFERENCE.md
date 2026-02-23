# クイックリファレンス - エージェント操作

## よくある操作パターン

### 1. 日記追記 + カウンター更新 + アクティビティ記録

ユーザー: 「今日は自転車で50km走った」

```typescript
const today = new Date().toISOString().split('T')[0]; // "2026-02-22"
const km = 50;

// 1. 日記追記
const yearMonth = today.substring(0, 7); // "2026-02"
const diaryPath = `/home/developer/projects/adaptive-dashboard/data/diary/${yearMonth}.md`;

// ファイル読み込み
const diaryContent = await Read(diaryPath);

// 新しいエントリを追記
await Edit({
  path: diaryPath,
  oldText: diaryContent,
  newText: diaryContent + `\n## ${today}\n今日は自転車で${km}km走った。\n`
});

// 2. カウンター更新
const countersPath = '/home/developer/projects/adaptive-dashboard/data/counters.json';
const countersJson = await Read(countersPath);
const counters = JSON.parse(countersJson);

const currentValue = counters.bike_km_feb?.value || 0;
counters.bike_km_feb = {
  value: currentValue + km,
  updatedAt: today
};

await Write({
  path: countersPath,
  content: JSON.stringify(counters, null, 2)
});

// 3. アクティビティ追加
const activityPath = '/home/developer/projects/adaptive-dashboard/data/activity.json';
const activityJson = await Read(activityPath);
const activityData = JSON.parse(activityJson);

activityData.activities.push({
  date: today,
  count: km,
  type: 'bike_km'
});

await Write({
  path: activityPath,
  content: JSON.stringify(activityData, null, 2)
});
```

---

### 2. 新しいカウンターウィジェット追加

ユーザー: 「読書記録も追加して」

```typescript
// 1. layout.jsonに新しいウィジェット追加
const layoutPath = '/home/developer/projects/adaptive-dashboard/data/layout.json';
const layoutJson = await Read(layoutPath);
const layout = JSON.parse(layoutJson);

layout.widgets.push({
  id: 'books-counter',
  type: 'counter',
  position: { x: 6, y: 6 },
  size: { w: 3, h: 2 },
  config: {
    title: '今年読んだ本',
    dataPath: 'data/counters.json',
    key: 'books_read_2026',
    unit: '冊',
    color: 'purple'
  }
});

await Write({
  path: layoutPath,
  content: JSON.stringify(layout, null, 2)
});

// 2. counters.jsonに初期値設定
const countersPath = '/home/developer/projects/adaptive-dashboard/data/counters.json';
const countersJson = await Read(countersPath);
const counters = JSON.parse(countersJson);

counters.books_read_2026 = {
  value: 0,
  updatedAt: new Date().toISOString().split('T')[0]
};

await Write({
  path: countersPath,
  content: JSON.stringify(counters, null, 2)
});
```

---

### 3. マイルストーン追加

ユーザー: 「プロジェクトXを3月末までに完成させる目標を立てた」

```typescript
const milestonePath = '/home/developer/projects/adaptive-dashboard/data/milestones.json';
const milestoneJson = await Read(milestonePath);
const milestoneData = JSON.parse(milestoneJson);

milestoneData.milestones.push({
  id: `m${Date.now()}`,
  title: 'プロジェクトX完成',
  description: '',
  status: 'not-started',
  progress: 0,
  dueDate: '2026-03-31',
  createdAt: new Date().toISOString().split('T')[0]
});

await Write({
  path: milestonePath,
  content: JSON.stringify(milestoneData, null, 2)
});
```

---

### 4. TODO追加

ユーザー: 「ドキュメント更新をTODOに追加して」

```typescript
const todoPath = '/home/developer/projects/adaptive-dashboard/data/todos.json';
const todoJson = await Read(todoPath);
const todoData = JSON.parse(todoJson);

todoData.todos.push({
  id: `t${Date.now()}`,
  text: 'ドキュメント更新',
  done: false,
  createdAt: new Date().toISOString().split('T')[0]
});

await Write({
  path: todoPath,
  content: JSON.stringify(todoData, null, 2)
});
```

---

### 5. 体重記録（チャートデータ追加）

ユーザー: 「今日の体重は68.5kg」

```typescript
const chartPath = '/home/developer/projects/adaptive-dashboard/data/charts/weight.json';
const chartJson = await Read(chartPath);
const chartData = JSON.parse(chartJson);

const today = new Date().toISOString().split('T')[0];
chartData.data.push({
  date: today,
  value: 68.5
});

await Write({
  path: chartPath,
  content: JSON.stringify(chartData, null, 2)
});
```

---

### 6. ウィジェットのリサイズ

ユーザー: 「自転車のカウンターを大きくして」

```typescript
const layoutPath = '/home/developer/projects/adaptive-dashboard/data/layout.json';
const layoutJson = await Read(layoutPath);
const layout = JSON.parse(layoutJson);

const widget = layout.widgets.find((w: any) => w.id === 'bike-counter');
if (widget) {
  widget.size = { w: 4, h: 3 }; // 元は { w: 3, h: 2 }
}

await Write({
  path: layoutPath,
  content: JSON.stringify(layout, null, 2)
});
```

---

## ファイルパス一覧

```
/home/developer/projects/adaptive-dashboard/data/
├── layout.json           # ウィジェット配置
├── diary/
│   └── YYYY-MM.md       # 月ごとの日記
├── counters.json        # カウンター値
├── activity.json        # アクティビティログ
├── milestones.json      # マイルストーン
├── todos.json           # TODO
└── charts/
    └── *.json           # チャートデータ
```

---

## 注意事項

1. **JSON整合性**: 必ず `JSON.parse()` でバリデーション
2. **既存データ保護**: Read → 変更 → Write
3. **日付フォーマット**: `YYYY-MM-DD`（例: `2026-02-22`）
4. **ウィジェットID**: 一意であること
5. **グリッド配置**: columns=12、position/sizeが重ならないように

---

## デバッグ

開発サーバーログを確認:
```bash
cd /home/developer/projects/adaptive-dashboard
pnpm dev
```

ブラウザで http://localhost:3000 を開いてウィジェット表示を確認。
