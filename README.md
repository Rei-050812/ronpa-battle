# 上司論破バトル 🎮⚔️

ブラック企業の理不尽な上司を3つのフレーズで論破するバイラルゲーム！

格ゲー風の演出とClaude AIによる動的コンテンツ生成・判定で、あなたの論破力を試そう！

## 🎯 コンセプト

喧嘩番長2の「メンチ切り」風のゲーム性で、ブラック上司の発言に対して論破する返答を3つのフレーズで組み立てるエンタメアプリ。
全てのコンテンツ（上司発言、フレーズ選択肢）はClaude APIで動的生成されます。

## ✨ 特徴

- 🤖 **Claude AI搭載**: 上司の発言もフレーズも毎回ユニークに生成
- ⚡ **3秒カウントダウン**: 緊張感のあるリアルタイムバトル
- 🎮 **格ゲー風UI**: VS画面、判定演出、スコアシステム
- 📱 **スマホ対応**: レスポンシブデザインでどこでも遊べる
- 🔥 **連続モード**: 何回連続で論破できるかチャレンジ！
- 🐦 **SNSシェア**: Twitterでスコアをシェアしてバイラルへ

## 🎬 ゲームフロー

1. **バトル開始**: ボタンをクリックして連続モードスタート
2. **VS画面**: 上司の理不尽発言が表示される
3. **フレーズ選択×3回**: 各3秒のカウントダウンで選択
   - 第1フレーズ（文頭）
   - 第2フレーズ（中盤）
   - 第3フレーズ（締め）
4. **返答表示**: 選んだフレーズが文章になって表示
5. **Claude AIが判定**:
   - 80-100点: 完璧な論破！（+100pt）
   - 60-79点: まあまあ論破（+50pt）
   - 40-59点: 微妙...（+10pt）
   - 0-39点: 意味不明で負け（K.O.）
6. **結果表示**: スコア、称号、Twitterシェア

## 🛠️ 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Claude API** (Anthropic SDK)
- **Vercel** (デプロイ)

## 📦 セットアップ

### 1. リポジトリのクローン

```bash
git clone <your-repo-url>
cd ronpa-battle
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定（必須）

プロジェクトルートに`.env.local`ファイルを作成し、Anthropic API Keyを設定してください：

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**API Keyの取得方法:**
1. [Anthropic Console](https://console.anthropic.com/)にアクセス
2. アカウント作成/ログイン
3. API Keys → "Create Key"
4. 生成されたキーを`.env.local`に設定

⚠️ **重要**:
- `.env.local`ファイルは`.gitignore`に含まれており、Gitにコミットされません
- API Keyは絶対に公開リポジトリにプッシュしないでください
- Vercelにデプロイする際は、Vercelの環境変数設定で同じキーを設定してください

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 🚀 Vercelへのデプロイ

### 前提条件
- GitHubアカウント
- Vercelアカウント（無料）

### デプロイ手順

1. **GitHubにプッシュ**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Vercelでインポート**

- [Vercel](https://vercel.com/)にログイン
- "Add New Project"をクリック
- GitHubリポジトリを選択
- プロジェクト名: `ronpa-battle`
- Framework Preset: `Next.js` (自動検出)

3. **環境変数の設定**

デプロイ設定画面で環境変数を追加:

```
ANTHROPIC_API_KEY = your_actual_api_key_here
```

4. **デプロイ実行**

"Deploy"ボタンをクリックして完了！

デプロイが完了すると、`https://ronpa-battle.vercel.app`のようなURLが発行されます。

### カスタムドメインの設定（オプション）

1. Vercelプロジェクトの"Settings" → "Domains"
2. `ronpa-battle.com`を追加
3. DNSレコードを設定（Vercelが指示を表示）

## 📁 プロジェクト構造

```
ronpa-battle/
├── app/
│   ├── api/
│   │   ├── generate-battle/   # 上司発言とフレーズ生成API
│   │   │   └── route.ts
│   │   └── judge/              # 返答の判定API
│   │       └── route.ts
│   ├── globals.css             # グローバルスタイル
│   ├── layout.tsx              # ルートレイアウト
│   └── page.tsx                # メインページ
├── components/
│   ├── ModeSelection.tsx       # モード選択画面
│   ├── BattleScreen.tsx        # バトル画面（メイン）
│   ├── VSScreen.tsx            # VS演出画面
│   ├── PhraseSelector.tsx      # フレーズ選択UI
│   ├── JudgmentScreen.tsx      # 判定結果画面
│   └── ResultScreen.tsx        # 最終結果画面
├── types/
│   └── index.ts                # TypeScript型定義
├── .env.local                  # 環境変数（Git除外）
├── .gitignore
├── package.json
└── README.md
```

## 🎮 ゲームロジック

### スコアリングシステム

| 判定結果 | スコア | 条件 |
|---------|-------|------|
| 完璧な論破！ | +100pt | 80-100点 |
| まあまあ論破 | +50pt | 60-79点 |
| 微妙... | +10pt | 40-59点 |
| 意味不明で負け | 0pt | 0-39点（ゲームオーバー） |

### 称号システム

| 総スコア | 称号 |
|---------|------|
| 500+ | 伝説の論破王 |
| 300-499 | 論破マスター |
| 150-299 | 論破の達人 |
| 80-149 | 論破見習い |
| 50-79 | 新人論破者 |
| 0-49 | 論破修行中 |

## 🔒 セキュリティ

- ✅ API Keyは`.env.local`で管理
- ✅ クライアント側にAPIキーを露出させない
- ✅ API Route経由でのみClaude APIを呼び出し
- ✅ `.gitignore`に`.env*`を追加済み

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエスト歓迎！

## 📧 お問い合わせ

- ハッシュタグ: #上司論破バトル
- URL: https://ronpa-battle.zero-venture.com

---

Presented by **ZEROVENTURE**
Built with ❤️ using Next.js and Claude AI
