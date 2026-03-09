# OpenClaw統合型デプロイメント

この構成では、Adaptive DashboardをOpenClawと同じDockerコンテナ内で動作させます。

## 🎯 メリット

- ✅ シンプルな構成（1つのコンテナで完結）
- ✅ ネットワーク設定不要
- ✅ データ共有が簡単（同じファイルシステム）
- ✅ 管理が楽（1つのコンテナを管理するだけ）
- ✅ リソース効率が良い

## 🏗️ アーキテクチャ

```
OpenClaw Container
├── OpenClaw (メインプロセス)
├── Adaptive Dashboard (Next.js)
└── supervisord (プロセス管理)
```

## 🚀 セットアップ手順

### 1. 必要なファイルをコピー

OpenClawのプロジェクトディレクトリにダッシュボードを配置：

```bash
# OpenClawのプロジェクトディレクトリに移動
cd /path/to/openclaw

# ダッシュボードをクローン
git clone https://github.com/samayunkur/adaptive-dashboard.git dashboard
```

### 2. Dockerfile修正

OpenClawの `Dockerfile` に追加：

```dockerfile
# Node.jsがインストール済みと仮定

# ダッシュボード用の依存関係をインストール
COPY dashboard/package.json dashboard/pnpm-lock.yaml ./dashboard/
RUN cd dashboard && pnpm install --frozen-lockfile

# ダッシュボードのソースをコピー
COPY dashboard ./dashboard

# ビルド
RUN cd dashboard && pnpm build

# supervisordインストール
RUN apt-get update && apt-get install -y supervisor

# supervisord設定をコピー
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# ポート公開（OpenClaw + ダッシュボード）
EXPOSE 8080 3000

CMD ["/usr/bin/supervisord"]
```

### 3. supervisord設定

`supervisord.conf` を作成：

```ini
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid

[program:openclaw]
command=node /app/index.js
directory=/app
autostart=true
autorestart=true
stderr_logfile=/var/log/openclaw/err.log
stdout_logfile=/var/log/openclaw/out.log
environment=NODE_ENV="production"

[program:dashboard]
command=node /app/dashboard/.next/standalone/server.js
directory=/app/dashboard
autostart=true
autorestart=true
stderr_logfile=/var/log/dashboard/err.log
stdout_logfile=/var/log/dashboard/out.log
environment=NODE_ENV="production",HOSTNAME="0.0.0.0",PORT="3000"
```

### 4. docker-compose.yml

```yaml
version: '3.9'

services:
  openclaw:
    build: .
    container_name: openclaw-with-dashboard
    ports:
      - "8080:8080"  # OpenClaw
      - "3000:3000"  # Dashboard
    volumes:
      - ./dashboard/data:/app/dashboard/data
      - ./workspace:/root/.openclaw/workspace
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### 5. 起動

```bash
docker-compose up -d
```

## 🔧 使用方法

### ユーザーアクセス

- **OpenClaw**: `http://localhost:8080`
- **ダッシュボード**: `http://localhost:3000`

### OpenClawからの操作

OpenClawエージェントは同じコンテナ内で動作しているため、`localhost:3000` でアクセス可能：

```bash
# カウンター更新
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"type":"counter","action":"update","data":{"key":"bike_km","value":50}}'

# 日記追記
curl -X POST http://localhost:3000/api/diary \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-02-23","content":"今日の出来事"}'
```

## 📊 データ共有

OpenClawとダッシュボードは同じファイルシステムを共有：

```
/app/dashboard/data/
├── layout.json       # 共有
├── counters.json     # 共有
├── diary/            # 共有
└── ...
```

OpenClawから直接ファイル編集も可能：

```javascript
// OpenClawエージェント内で
const fs = require('fs');
const path = '/app/dashboard/data/counters.json';
const counters = JSON.parse(fs.readFileSync(path, 'utf-8'));
counters.bike_km.value += 10;
fs.writeFileSync(path, JSON.stringify(counters, null, 2));
```

## 🎨 カスタマイズ

### ポート変更

```yaml
ports:
  - "9000:3000"  # ダッシュボードをポート9000で公開
```

### 環境変数

```yaml
environment:
  - DASHBOARD_PORT=3000
  - NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🔍 ログ確認

```bash
# 全ログ
docker logs openclaw-with-dashboard

# OpenClawのみ
docker exec openclaw-with-dashboard cat /var/log/openclaw/out.log

# ダッシュボードのみ
docker exec openclaw-with-dashboard cat /var/log/dashboard/out.log
```

## 🛠️ トラブルシューティング

### プロセス確認

```bash
docker exec openclaw-with-dashboard supervisorctl status
```

### プロセス再起動

```bash
# ダッシュボードのみ再起動
docker exec openclaw-with-dashboard supervisorctl restart dashboard

# OpenClawのみ再起動
docker exec openclaw-with-dashboard supervisorctl restart openclaw
```

## 💡 ベストプラクティス

1. **データバックアップ**: `dashboard/data/` を定期的にバックアップ
2. **ログローテーション**: supervisordのログ設定を調整
3. **リソース監視**: メモリ使用量を監視（2つのプロセスが動くため）

## 📚 関連ドキュメント

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - 基本セットアップ
- [OPENCLAW_INTEGRATION.md](./OPENCLAW_INTEGRATION.md) - 分離型統合ガイド
