#!/bin/bash
# エラーが発生したらスクリプトを終了する
set -e

# 2つ目のデータベース 'auth_db' を作成する
echo "Creating database 'auth_db'"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE auth_db;
EOSQL
echo "Database 'auth_db' created"

# 'db'データベースに対してSQLファイルを実行する
echo "Initializing 'db' database..."
for f in /docker-entrypoint-initdb.d/01_app/*.sql; do
    echo "Processing $f file..."
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$f"
done

# 'auth_db'データベースに対してSQLファイルを実行する
echo "Initializing 'auth_db' database..."
for f in /docker-entrypoint-initdb.d/02_auth/*.sql; do
    echo "Processing $f file..."
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "auth_db" -f "$f"
done

echo "Database initialization completed."