# tropical-362827のSS用ギャラリー

X(旧Twitter)で公開している、illusionやILLGAMESのシーンデータ・キャラデータを公開するためのサイトです。

https://tropical-362827.github.io/gallery/

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