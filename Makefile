.PHONY: help setup install dev build preview clean lint deploy all

# デフォルトの実行コマンド（help）
all: help

# 各コマンドの説明を表示
help:
	@echo "使用可能なコマンド:"
	@echo "  make setup     - Node.jsの環境をセットアップし、必要なパッケージをインストール"
	@echo "  make install   - 依存パッケージをインストール"
	@echo "  make dev       - 開発サーバーを起動 (http://localhost:5173/)"
	@echo "  make build     - プロダクション用にビルド"
	@echo "  make preview   - ビルドした結果をプレビュー"
	@echo "  make clean     - ビルドファイルとnode_modulesを削除"
	@echo "  make lint      - コードのlintを実行"
	@echo "  make deploy    - GitHub Pagesへデプロイするためのビルド"

# 環境セットアップ
setup:
	@echo "Node.js環境をチェック中..."
	@node -v || (echo "Node.jsがインストールされていません。Node.jsをインストールしてください。" && exit 1)
	@echo "パッケージをインストール中..."
	@npm install
	@echo "セットアップが完了しました。"

# 依存パッケージのインストール
install:
	@echo "依存パッケージをインストール中..."
	@npm install
	@echo "依存パッケージのインストールが完了しました。"

# 開発サーバーの起動
dev:
	@echo "開発サーバーを起動中... (http://localhost:5173/)"
	@npm run dev

# プロダクション用ビルド
build:
	@echo "プロダクション用にビルド中..."
	@npm run build
	@echo "ビルドが完了しました。"

# ビルド結果のプレビュー
preview:
	@echo "ビルド結果をプレビュー中..."
	@npm run preview

# クリーンアップ
clean:
	@echo "ビルドファイルとnode_modulesを削除中..."
	@rm -rf dist node_modules
	@echo "クリーンアップが完了しました。"

# コードのlint
lint:
	@echo "コードのlintを実行中..."
	@npm run lint
	@echo "lintが完了しました。"

# GitHub Pagesへのデプロイ用ビルド
deploy:
	@echo "GitHub Pages用にビルド中..."
	@npm run build
	@echo "ビルドが完了しました。GitHub Actionsのワークフローによって自動的にデプロイされます。"