# 顔認証サーバー

1. dlibのビルドのためにcmakeをインストールしておく
```
apt install cmake
brew install cmake
```

1. 仮想環境を作成
```
cd ai
uv venv
```

1. パッケージをインストール
```
uv pip install '.[cpu]' # for CPU
uv pip install '.[gpu]' # for GPU
```

1. パッケージをsyncする
```
uv sync --extra cpu # for CPU
uv sync --extra gpu # for GPU
```