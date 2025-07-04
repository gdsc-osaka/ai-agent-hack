set -e

# Generate OpenAPI spec from local server
curl -o tmp.openapi.json "http://localhost:8080/api/openapi"

# Install OpenAPI Generator if not already installed
# openapi-generator --version || brew install openapi-generator # GitHub Actions では brew が使えないため、npm を使用
# openapi-typescript --version || npm install -g openapi-typescript

# Generate TypeScript Client
(cd web && node --experimental-strip-types generate-openapi-types.ts ../tmp.openapi.json ../web/src/openapi/tmp.types.ts)

# Clean up temporary files
rm tmp.openapi.json
rm web/src/openapi/types.ts
mv web/src/openapi/tmp.types.ts web/src/openapi/types.ts

echo "Adding generated files to git..."
git add -A web/src/openapi
