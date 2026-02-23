# デプロイガイド

## Vercelへのデプロイ

### 1. GitHubリポジトリ作成

```bash
cd /home/developer/projects/adaptive-dashboard

# GitHubで新しいリポジトリを作成してから
git remote add origin https://github.com/YOUR_USERNAME/adaptive-dashboard.git
git branch -M main
git push -u origin main
```

### 2. Vercelプロジェクト作成

1. [Vercel](https://vercel.com)にログイン
2. 「Add New Project」をクリック
3. GitHubリポジトリ「adaptive-dashboard」を選択
4. 「Deploy」をクリック

デフォルト設定のままでデプロイ可能。Next.js 15を自動検出します。

### 3. 環境変数（オプション）

現在のバージョンでは環境変数は不要ですが、将来的にAPI連携などを追加する場合は設定してください。

---

## Netlifyへのデプロイ

### 1. `netlify.toml` 作成

```toml
[build]
  command = "pnpm build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 2. デプロイ

1. [Netlify](https://netlify.com)にログイン
2. 「Add new site」→「Import an existing project」
3. GitHubリポジトリを選択
4. Build command: `pnpm build`
5. Publish directory: `.next`
6. 「Deploy」をクリック

---

## セルフホスティング（VPS/専用サーバー）

### 必要なもの

- Node.js 18以上
- pnpm
- Git

### デプロイ手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/adaptive-dashboard.git
cd adaptive-dashboard

# 2. 依存関係をインストール
pnpm install

# 3. ビルド
pnpm build

# 4. 起動
pnpm start
```

デフォルトでポート3000で起動します。

### PM2で常駐化

```bash
# PM2インストール
npm install -g pm2

# 起動
pm2 start pnpm --name "adaptive-dashboard" -- start

# 自動起動設定
pm2 startup
pm2 save
```

### Nginx リバースプロキシ設定例

```nginx
server {
    listen 80;
    server_name dashboard.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## データ永続化の注意点

### デプロイ環境での注意

VercelやNetlifyなどのサーバーレス環境では、ファイルシステムへの書き込みが制限されています。

**現在の実装**: `data/` ディレクトリのファイルを直接編集

**サーバーレス環境での対策**:

1. **Git管理のみ**（推奨・最もシンプル）
   - ローカルで編集 → Git push → 自動デプロイ
   - エージェントはローカル環境でのみデータ更新

2. **外部ストレージ統合**（将来の拡張）
   - Amazon S3
   - Google Cloud Storage
   - Supabase Storage

3. **データベース統合**（将来の拡張）
   - Vercel Postgres
   - PlanetScale
   - Supabase

### 推奨構成（現在）

- **開発・データ更新**: ローカル環境（OpenClawエージェント）
- **公開**: Vercel/Netlify（読み取り専用）
- **デプロイフロー**: ローカル編集 → Git push → 自動デプロイ

---

## GitHub Actions 自動デプロイ設定

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## まとめ

- **個人利用・テスト**: Vercel無料プラン（推奨）
- **本番運用・データ更新**: セルフホスティング + PM2
- **現在のバージョン**: ローカル開発 + Git管理 + Vercel公開が最適
