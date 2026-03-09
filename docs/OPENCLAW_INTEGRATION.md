# OpenClaw統合ガイド

このガイドでは、OpenClawエージェントとAdaptive Dashboardを統合して、リアルタイム更新を実現する方法を説明します。

## 🐳 Dockerネットワーク設定

### 1. ネットワーク作成

```bash
# OpenClawとダッシュボード用の共通ネットワークを作成
docker network create openclaw-network
```

### 2. ダッシュボード起動

```bash
cd /home/developer/projects/adaptive-dashboard

# ネットワーク対応版で起動
docker-compose -f docker-compose.network.yml up -d adaptive-dashboard-dev
```

### 3. OpenClawの設定

OpenClawの `docker-compose.yml` に以下を追加：

```yaml
services:
  openclaw:
    # ... 既存の設定 ...
    networks:
      - openclaw-network

networks:
  openclaw-network:
    external: true
```

OpenClawを再起動：

```bash
docker-compose down
docker-compose up -d
```

---

## 🔗 API エンドポイント

### OpenClawコンテナから（Dockerネットワーク内）

```
http://adaptive-dashboard-dev:3000/api/data
http://adaptive-dashboard-dev:3000/api/diary
```

### ホストマシンから（ブラウザアクセス）

```
http://localhost:3000/api/data
http://localhost:3000/api/diary
```

---

## 📊 API操作

### カウンター更新

```bash
curl -X POST http://adaptive-dashboard-dev:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{
    "type": "counter",
    "action": "update",
    "data": {
      "key": "bike_km",
      "value": 50
    }
  }'
```

### アクティビティ追加

```bash
curl -X POST http://adaptive-dashboard-dev:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{
    "type": "activity",
    "action": "add",
    "data": {
      "date": "2025-02-23",
      "count": 10,
      "type": "commit"
    }
  }'
```

### TODO追加

```bash
curl -X POST http://adaptive-dashboard-dev:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{
    "type": "todo",
    "action": "add",
    "data": {
      "text": "新しいタスク"
    }
  }'
```

### 日記追記

```bash
curl -X POST http://adaptive-dashboard-dev:3000/api/diary \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-02-23",
    "content": "今日は10km走った！"
  }'
```

### マイルストーン追加

```bash
curl -X POST http://adaptive-dashboard-dev:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{
    "type": "milestone",
    "action": "add",
    "data": {
      "title": "100km走破",
      "description": "月末までに100km走る",
      "dueDate": "2025-03-31"
    }
  }'
```

---

## 🔄 リアルタイム更新の仕組み

### 自動更新設定

ダッシュボードは **SWR** を使用して3秒ごとに自動更新：

```typescript
// lib/use-realtime.ts
const REALTIME_CONFIG = {
  refreshInterval: 3000,  // 3秒ごと
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
};
```

### ユーザー体験

1. ユーザーがブラウザで `http://localhost:3000` を開く
2. OpenClawが会話から「今日は10km走った」を検知
3. OpenClawがAPIを叩いてデータを更新
4. **3秒以内に**ユーザーのダッシュボードが自動更新
5. ユーザーはリロード不要

---

## 💬 使用例

### 例1: ランニング記録

**ユーザー:** 「今日は10km走った」

**OpenClawの自動操作:**
```bash
# 1. カウンター更新
curl -X POST http://adaptive-dashboard-dev:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"type":"counter","action":"increment","data":{"key":"running_km","increment":10}}'

# 2. アクティビティ追加
curl -X POST http://adaptive-dashboard-dev:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"type":"activity","action":"add","data":{"date":"2025-02-23","count":10,"type":"running_km"}}'

# 3. 日記追記
curl -X POST http://adaptive-dashboard-dev:3000/api/diary \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-02-23","content":"今日は10km走った"}'
```

**結果:** ユーザーのダッシュボードが3秒以内に自動更新

### 例2: 読書記録

**ユーザー:** 「本を1冊読み終えた」

**OpenClawの自動操作:**
```bash
curl -X POST http://adaptive-dashboard-dev:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"type":"counter","action":"increment","data":{"key":"books_read","increment":1}}'

curl -X POST http://adaptive-dashboard-dev:3000/api/diary \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-02-23","content":"本を1冊読み終えた"}'
```

### 例3: 目標設定

**ユーザー:** 「来月までに50km走る目標を設定したい」

**OpenClawの自動操作:**
```bash
curl -X POST http://adaptive-dashboard-dev:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{
    "type": "milestone",
    "action": "add",
    "data": {
      "title": "50km走破",
      "description": "月末までに50km走る目標",
      "status": "in-progress",
      "dueDate": "2025-03-31"
    }
  }'
```

---

## 🛠️ TOOLS.md設定

`~/.openclaw/workspace/TOOLS.md` に追加：

```markdown
### Adaptive Dashboard

- **プロジェクトパス**: `/home/developer/projects/adaptive-dashboard`
- **API**: http://adaptive-dashboard-dev:3000/api/data
- **日記API**: http://adaptive-dashboard-dev:3000/api/diary
- **Dockerネットワーク**: openclaw-network

#### Docker環境での操作

**コンテナの状態確認:**
```bash
docker ps | grep adaptive-dashboard
```

**カウンター更新:**
```bash
curl -X POST http://adaptive-dashboard-dev:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"type":"counter","action":"update","data":{"key":"bike_km","value":50}}'
```

**アクティビティ追加:**
```bash
curl -X POST http://adaptive-dashboard-dev:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"type":"activity","action":"add","data":{"date":"2025-02-23","count":10,"type":"commit"}}'
```

**日記追記:**
```bash
curl -X POST http://adaptive-dashboard-dev:3000/api/diary \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-02-23","content":"今日の出来事..."}'
```

#### 会話からの自動更新

ユーザーが日常の出来事を話したら：
- 「今日は10km走った」→ カウンター更新 + アクティビティ追加 + 日記追記
- 「本を1冊読んだ」→ カウンター更新 + アクティビティ追加
- 「新しい目標を設定したい」→ マイルストーン追加

**リアルタイム更新:** ユーザーのダッシュボードは3秒以内に自動更新されます。
```

---

## 🔧 トラブルシューティング

### ネットワーク接続確認

```bash
# OpenClawコンテナからダッシュボードへの接続確認
docker exec -it openclaw ping adaptive-dashboard-dev

# API接続確認
docker exec -it openclaw curl http://adaptive-dashboard-dev:3000/api/data
```

### コンテナログ確認

```bash
# ダッシュボードのログ
docker logs adaptive-dashboard-dev -f

# OpenClawのログ
docker logs openclaw -f
```

### ネットワーク一覧確認

```bash
docker network ls
docker network inspect openclaw-network
```

---

## 🎯 ベストプラクティス

1. **定期的なバックアップ**: `data/` ディレクトリを定期的にバックアップ
2. **ログ監視**: エラーがないか定期的にログを確認
3. **ネットワーク分離**: 本番環境では別のネットワークを使用
4. **環境変数管理**: `.env` ファイルで環境ごとの設定を管理

---

## 📚 関連ドキュメント

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - 基本セットアップ
- [AGENT_GUIDE.md](./AGENT_GUIDE.md) - エージェント詳細ガイド
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - 操作リファレンス
