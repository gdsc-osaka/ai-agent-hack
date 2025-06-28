# 顔認証サーバー

1. dlibのビルドのためにcmakeをインストールしておく
```
apt install cmake
brew install cmake
```

2. 仮想環境を作成
```
cd ai
uv venv
source .venv/bin/activate
```

3. パッケージをインストール
```
uv pip install '.[cpu]' # for CPU
uv pip install '.[gpu]' # for GPU
```

4. パッケージをsyncする
```
uv sync --extra cpu # for CPU
uv sync --extra gpu # for GPU
```

5. 実行
```
uv run src/main.py
```