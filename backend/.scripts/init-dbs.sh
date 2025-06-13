#!/bin/bash

# Dockerfile.preview.db 初期化用スクリプト

# This script is executed when the container starts for the first time.
set -e

# The main database 'db' is automatically created by the postgres entrypoint
# because it's specified in the POSTGRES_DB environment variable.
# We will now run the initialization scripts for the 'db' database.

echo "Initializing database: db"
# Loop through all .sql files in the app-sql directory and apply them.
for f in /docker-entrypoint-initdb.d/app-sql/*.sql; do
  echo "Applying schema $f to database 'db'..."
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "db" -f "$f"
done

# Now, create the 'auth_db' database.
# We connect to the default 'postgres' database to run the CREATE DATABASE command.
echo "Creating database: auth_db"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    CREATE DATABASE auth_db;
EOSQL

# Initialize the 'auth_db' database.
echo "Initializing database: auth_db"
# Loop through all .sql files in the auth-sql directory and apply them.
for f in /docker-entrypoint-initdb.d/auth-sql/*.sql; do
  echo "Applying schema $f to database 'auth_db'..."
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "auth_db" -f "$f"
done
