#!/bin/sh

set -e # エラーが発生したらスクリプトを終了する

# スクリプトの引数からホスト名とコマンドを取得
# shift コマンドで引数をずらし、残りをAPIサーバーの起動コマンドとして扱う
host="$1"
shift
cmd="$@"

echo "Waiting for PostgreSQL at $host:5432..."

# pg_isready を使ってPostgreSQLが準備完了になるまでループで待機
# -h でホストを指定し、-U でユーザーを指定する
# 2>&1 >/dev/null でエラー出力(stderr)と標準出力(stdout)を捨てて、静かに実行する
until pg_isready --host="$host" --port=5432 --dbname=db --username="user" -q; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

# PostgreSQLの準備ができたらメッセージを出力
>&2 echo "Postgres is up - executing command"
# exec "$@" で、本来実行したかったコマンド（例: npm start）を実行する
# exec を使うと、このシェルスクリプトのプロセスがメインのコマンドのプロセスに置き換わるため、
# シグナル（例: Cloud Runからの停止シグナル）が正しくAPIサーバーに伝わる
exec $cmd