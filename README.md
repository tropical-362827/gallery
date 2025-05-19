# ゲーム画像ギャラリー

ゲーム画像を展示するギャラリーサイトです。ユーザーはギャラリーの画像をクリックすることで、そのゲーム画像のシーンデータをダウンロードできます。

## 機能

- 複数ゲームのギャラリー表示
- シーン画像とキャラクター画像の2つのセクション
- 画像クリック時のデータ画像ダウンロード機能
- レスポンシブデザイン
- GitHub Pages対応

## 技術スタック

- [React](https://reactjs.org/) - UIライブラリ
- [TypeScript](https://www.typescriptlang.org/) - 型安全なJavaScript
- [Vite](https://vitejs.dev/) - 高速な開発環境とビルドツール
- [React Router](https://reactrouter.com/) - ルーティング
- [Styled Components](https://styled-components.com/) - スタイリング

## 開発環境のセットアップ

### 前提条件

- [Node.js](https://nodejs.org/) (v14以上)
- [npm](https://www.npmjs.com/) (v6以上)

### インストール

このリポジトリをクローンした後、以下のコマンドを実行して開発環境をセットアップできます。

```bash
# Makefileを使用する場合
make setup

# または手動で
npm install
```

## 開発

以下のコマンドを使用して開発サーバーを起動します。

```bash
# Makefileを使用する場合
make dev

# または手動で
npm run dev
```

開発サーバーは http://localhost:5173/ で起動します。

## ビルド

プロダクション用のビルドを行うには以下のコマンドを実行します。

```bash
# Makefileを使用する場合
make build

# または手動で
npm run build
```

ビルドされたファイルは `dist` ディレクトリに出力されます。

## ビルド結果のプレビュー

ビルドした結果をプレビューするには以下のコマンドを実行します。

```bash
# Makefileを使用する場合
make preview

# または手動で
npm run preview
```

## 利用可能なコマンド

このプロジェクトでは以下のMakeコマンドが利用可能です：

- `make setup` - Node.jsの環境をセットアップし、必要なパッケージをインストール
- `make install` - 依存パッケージをインストール
- `make dev` - 開発サーバーを起動
- `make build` - プロダクション用にビルド
- `make preview` - ビルドした結果をプレビュー
- `make clean` - ビルドファイルとnode_modulesを削除
- `make lint` - コードのlintを実行
- `make deploy` - GitHub Pagesへデプロイするためのビルド

## デプロイ

このプロジェクトはGitHub Pagesを使用してデプロイする設定が含まれています。mainブランチにプッシュすると、GitHub Actionsによって自動的にデプロイされます。

## プロジェクト構造

```
.
├── .github/workflows  # GitHub Actions設定
├── images/            # ゲーム画像ファイル
│   ├── game1/         # ゲーム1の画像
│   │   ├── scenes/    # シーン画像
│   │   │   ├── display/ # 16:9の表示用画像
│   │   │   └── data/    # 320x180のダウンロード用画像
│   │   └── characters/  # 252x352のキャラクター画像
│   └── game2/         # ゲーム2の画像
│       └── ...
├── public/            # 静的ファイル
│   └── data/          # メタデータJSON
├── src/               # ソースコード
│   ├── components/    # Reactコンポーネント
│   ├── pages/         # ページコンポーネント
│   ├── styles/        # スタイル定義
│   ├── types/         # TypeScript型定義
│   └── utils/         # ユーティリティ関数
├── .gitignore         # Gitの無視ファイル設定
├── Makefile           # 開発用コマンド
├── index.html         # エントリーポイントHTML
├── package.json       # NPM設定
├── README.md          # このファイル
├── tsconfig.json      # TypeScript設定
└── vite.config.ts     # Vite設定
```

## 画像データの追加方法

新しい画像を追加するには：

1. `images/` ディレクトリに適切なサブディレクトリを作成（または既存のディレクトリを使用）
2. `public/data/gallery-data.json` ファイルに新しい画像のメタデータを追加

画像サイズ：
- シーンデータ画像(表示用): 1920x1080などの16:9のサイズ
- シーンデータ画像(データ用): 320x180
- キャラクター画像: 252x352

## ライセンス

このプロジェクトは [MIT ライセンス](LICENSE) の下で公開されています。