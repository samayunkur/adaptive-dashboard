# Adaptive Dashboard セットアップガイド

このガイドでは、Adaptive Dashboardを自分の環境で使用するための手順を説明します。

## 📋 前提条件

### Dockerを使用する場合（推奨）
- Docker 20以上
- Docker Compose 2以上

### ローカルインストールする場合
- Node.js 18以上
- pnpm（推奨）またはnpm/yarn
- Git

---

## 🚀 セットアップ手順

### 方法1: Docker使用（推奨）

#### 開発環境での起動

```bash
# 1. リポジトリをクローン
git clone https://github.com/samayunkur/adaptive-dashboard.git
cd adaptive-dashboard

# 2. 環境変数を設定（オプション）
cp .env.example .env

# 3. Docker Composeで起動
docker-compose up adaptive-dashboard-dev
```

ブラウザで http://localhost:3000 を開く。

#### 本番環境での起動

```bash
# 本番用イメージをビルド・起動
docker-compose up adaptive-dashboard-prod
```

#### バックグラウンドで起動

```bash
# 開発環境
docker-compose up -d adaptive-dashboard-dev

# 本番環境
docker-compose up -d adaptive-dashboard-prod
```

#### コンテナの停止

```bash
docker-compose down
```

#### ログの確認

```bash
# 全コンテナのログ
docker-compose logs

# 特定のコンテナのログ
docker-compose logs adaptive-dashboard-dev
```

---

### 方法2: ローカルインストール

```bash
# 1. クローン
git clone https://github.com/samayunkur/adaptive-dashboard.git
cd adaptive-dashboard

# 2. 依存関係をインストール
pnpm install

# 3. 開発サーバーを起動
pnpm dev
```

ブラウザで http://localhost:3000 を開く。

---

### 方法3: Vercelにデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/samayunkur/adaptive-dashboard)

---

## 🌍 外部アクセスの設定

Dockerコンテナを外部からアクセス可能にする場合：

### 方法1: ポートマッピング

`docker-compose.yml` でポートを変更：

```yaml
ports:
  - "8080:3000"  # 外部ポート8080 → 内部ポート3000
```

アクセス: `http://your-server-ip:8080`

### 方法2: 環境変数でURL設定

`.env` ファイルを編集：

```env
# 外部ドメインを設定
NEXT_PUBLIC_API_URL=https://your-domain.com
```

### 方法3: リバースプロキシ使用（本番推奨）

NginxやTraefikと組み合わせて使用：

```nginx
# Nginx設定例
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://adaptive-dashboard-prod:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 データの永続化

Docker環境では、`data/` ディレクトリがホストにマウントされます：

```yaml
volumes:
  - ./data:/app/data
```

### データのバックアップ

```bash
# データディレクトリをバックアップ
tar -czf dashboard-data-backup.tar.gz data/

# リストア
tar -xzf dashboard-data-backup.tar.gz
```

### 複数環境でのデータ共有

```yaml
volumes:
  # 共有ボリュームを使用
  - dashboard-data:/app/data

volumes:
  dashboard-data:
    driver: local
```

---

## 🔧 Docker環境でのカスタマイズ

### 環境変数の設定

`.env` ファイルを作成：

```env
# API URL（外部アクセス用）
NEXT_PUBLIC_API_URL=https://your-domain.com

# データベース（オプション）
# DATABASE_URL=postgresql://...
```

### ポートの変更

`docker-compose.yml` を編集：

```yaml
ports:
  - "8080:3000"  # 任意のポートに変更
```

### ビルド設定のカスタマイズ

カスタムDockerfileを使用：

```yaml
build:
  context: .
  dockerfile: Dockerfile.custom
```

---

## 🚀 本番デプロイメント

### Docker Swarm / Kubernetes

```yaml
# docker-compose.prod.yml
version: '3.9'

services:
  adaptive-dashboard:
    image: your-registry/adaptive-dashboard:latest
    ports:
      - "3000:3000"
    volumes:
      - dashboard-data:/app/data
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://your-domain.com
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure

volumes:
  dashboard-data:
```

デプロイ:

```bash
docker stack deploy -c docker-compose.prod.yml dashboard
```

### クラウドプラットフォーム

#### Google Cloud Run

```bash
# イメージをビルド
docker build -t gcr.io/PROJECT_ID/adaptive-dashboard .

# プッシュ
docker push gcr.io/PROJECT_ID/adaptive-dashboard

# デプロイ
gcloud run deploy --image gcr.io/PROJECT_ID/adaptive-dashboard --platform managed
```

#### AWS ECS

```bash
# ECRにプッシュ
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_REPO
docker build -t YOUR_ECR_REPO/adaptive-dashboard .
docker push YOUR_ECR_REPO/adaptive-dashboard

# ECSタスク定義で使用
```

#### Azure Container Instances

```bash
# ACRにプッシュ
az acr build --registry YOUR_ACR --image adaptive-dashboard .

# デプロイ
az container create \
  --resource-group myResourceGroup \
  --name adaptive-dashboard \
  --image YOUR_ACR.azurecr.io/adaptive-dashboard \
  --dns-name-label adaptive-dashboard \
  --ports 3000
```

---

## 🔗 OpenClawエージェントとの連携

OpenClawを使用している場合、エージェントがダッシュボードを自動更新できます。

### Docker環境での設定

`~/.openclaw/workspace/TOOLS.md` に追加：

```markdown
### Adaptive Dashboard

- **プロジェクトパス**: `/path/to/adaptive-dashboard`
- **API**: http://localhost:3000/api/data
- **Docker Composeパス**: `/path/to/docker-compose.yml`

#### Docker環境での操作

**コンテナの状態確認:**
```bash
docker-compose ps
```

**カウンター更新:**
```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"type":"counter","action":"update","data":{"key":"running_km","value":50}}'
```

**アクティビティ追加:**
```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"type":"activity","action":"add","data":{"date":"2025-02-23","count":10,"type":"commit"}}'
```

**日記追記:**
```bash
curl -X POST http://localhost:3000/api/diary \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-02-23","content":"今日の出来事..."}'
```

#### 会話からの自動更新

ユーザーが日常の出来事を話したら：
- 「今日は10km走った」→ カウンター更新 + アクティビティ追加 + 日記追記
- 「本を1冊読んだ」→ カウンター更新 + アクティビティ追加
- 「新しい目標を設定したい」→ マイルストーン追加
```

---

## 📊 データのカスタマイズ

### 初期データの確認

```
data/
├── layout.json       # ウィジェット配置
├── diary/            # 日記（Markdown）
│   └── 2026-02.md
├── counters.json     # カウンター
├── activity.json     # アクティビティログ
├── milestones.json   # マイルストーン
├── todos.json        # TODO
└── charts/           # チャートデータ
    └── weight.json
```

### サンプルデータの削除

初期状態のサンプルデータを削除して、自分のデータを始める：

```bash
# 日記をリセット
rm data/diary/*.md

# カウンターをリセット
echo "{}" > data/counters.json

# アクティビティをリセット
echo '{"activities": []}' > data/activity.json

# マイルストーンをリセット
echo '{"milestones": []}' > data/milestones.json

# TODOをリセット
echo '{"todos": []}' > data/todos.json
```

### 自分のデータを追加

#### カウンターの例

`data/counters.json`:
```json
{
  "running_km": { "value": 0, "updatedAt": "2025-02-23" },
  "books_read": { "value": 0, "updatedAt": "2025-02-23" }
}
```

#### 日記の例

`data/diary/2025-02.md`:
```markdown
# 2025年2月

## 2025-02-23
今日からダッシュボードを使い始めた！
```

---

## 🎨 ウィジェットのカスタマイズ

### レイアウトの編集

ブラウザで「編集モード」ボタンをクリック：
1. ウィジェットをドラッグして移動
2. コーナーをドラッグしてリサイズ
3. 「保存」ボタンでレイアウトを保存

### 新しいウィジェットの追加

`data/layout.json` に新しいウィジェットを追加：

```json
{
  "id": "my-counter",
  "type": "counter",
  "position": { "x": 0, "y": 0 },
  "size": { "w": 3, "h": 2 },
  "config": {
    "title": "走行距離",
    "dataPath": "data/counters.json",
    "key": "running_km",
    "unit": "km",
    "color": "blue"
  }
}
```

### 利用可能なウィジェット

| ウィジェット | type | 説明 |
|------------|------|------|
| 日記 | `diary` | Markdown日記表示 |
| カウンター | `counter` | 数値カウンター |
| ヒートマップ | `heatmap` | GitHub grass風 |
| マイルストーン | `milestone` | 進捗管理 |
| チャート | `chart` | グラフ表示 |
| TODO | `todo` | タスク管理 |
| Markdown | `markdown` | 汎用Markdown |

---

## 🔗 OpenClawエージェントとの連携

OpenClawを使用している場合、エージェントがダッシュボードを自動更新できます。

### TOOLS.mdに追加

`~/.openclaw/workspace/TOOLS.md` に以下を追加：

```markdown
### Adaptive Dashboard

- **プロジェクトパス**: `/home/developer/projects/adaptive-dashboard`
- **編集対象**: `data/layout.json`, `data/**/*.{json,md}`
- **API**: `http://localhost:3000/api/data`

#### エージェント操作例

**カウンター更新:**
```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"type":"counter","action":"update","data":{"key":"running_km","value":50}}'
```

**アクティビティ追加:**
```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"type":"activity","action":"add","data":{"date":"2025-02-23","count":10,"type":"commit"}}'
```

**TODO追加:**
```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"type":"todo","action":"add","data":{"text":"新しいタスク"}}'
```

**日記追記:**
```bash
curl -X POST http://localhost:3000/api/diary \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-02-23","content":"今日の出来事..."}'
```

#### 会話からの自動更新

ユーザーが日常の出来事を話したら：
- 「今日は10km走った」→ カウンター更新 + アクティビティ追加 + 日記追記
- 「本を1冊読んだ」→ カウンター更新 + アクティビティ追加
- 「新しい目標を設定したい」→ マイルストーン追加
```

---

## 🌐 本番デプロイ

### Vercelにデプロイ

#### 方法1: ワンクリックデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/samayunkur/adaptive-dashboard)

#### 方法2: 手動デプロイ

1. [Vercel](https://vercel.com)にログイン
2. 「Add New Project」→ GitHubリポジトリを選択
3. 「Deploy」をクリック

### ⚠️ 注意: Vercelの制限

Vercelのサーバーレス環境では**ファイル書き込みができません**。

**解決策:**

1. **読み取り専用モード**
   - ローカルでデータを編集
   - Gitでプッシュ
   - Vercelが自動デプロイ

2. **外部データベース使用**
   - Vercel Postgres
   - Supabase
   - MongoDB Atlas

---

## 🗄️ 外部データベースの使用（上級者向け）

### Vercel Postgres

```bash
pnpm add @vercel/postgres
```

`lib/db.ts` を Postgres版に置き換え：

```typescript
import { sql } from '@vercel/postgres';

export async function loadCounters() {
  const { rows } = await sql`SELECT * FROM counters`;
  return rows;
}
```

### Supabase

```bash
pnpm add @supabase/supabase-js
```

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function loadCounters() {
  const { data } = await supabase.from('counters').select('*');
  return data;
}
```

---

## 📱 使用例

### 例1: ランニング記録

**ユーザー:** 「今日は10km走った」

**エージェントの自動操作:**
1. カウンター更新: `running_km` + 10
2. アクティビティ追加: `{date: "2025-02-23", count: 10, type: "running_km"}`
3. 日記追記: 「今日は10km走った」

### 例2: 読書管理

**ユーザー:** 「本を1冊読み終えた」

**エージェントの自動操作:**
1. カウンター更新: `books_read` + 1
2. アクティビティ追加: `{date: "2025-02-23", count: 1, type: "book"}`
3. 日記追記: 「本を1冊読み終えた」

### 例3: 目標設定

**ユーザー:** 「来月までに50km走る目標を設定したい」

**エージェントの自動操作:**
1. マイルストーン追加:
   ```json
   {
     "title": "50km走破",
     "status": "in-progress",
     "dueDate": "2025-03-23"
   }
   ```

---

## 🔧 トラブルシューティング

### ポートが使用中

```bash
# 別のポートで起動
PORT=3001 pnpm dev
```

### データが反映されない

1. ブラウザをリロード（Cmd+R / F5）
2. サーバーを再起動（Ctrl+C → `pnpm dev`）
3. `.next`フォルダを削除して再起動

### LowDBエラー

```bash
# データファイルの権限確認
ls -la data/

# 必要に応じて権限修正
chmod 644 data/*.json
```

---

## 📚 さらなる情報

- [README.md](../README.md) - プロジェクト概要
- [AGENT_GUIDE.md](./AGENT_GUIDE.md) - エージェント詳細ガイド
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - 操作リファレンス

---

## 💡 ヒント

- **Gitでバージョン管理**: `data/` フォルダをGitで管理すれば、データの履歴を追跡できます
- **バックアップ**: 定期的に `data/` フォルダをバックアップ
- **複数環境**: 複数のPCで使う場合、Gitでデータを同期

---

**質問や問題がある場合は、[GitHub Issues](https://github.com/samayunkur/adaptive-dashboard/issues)でお知らせください！**
