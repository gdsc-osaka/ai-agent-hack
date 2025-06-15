set -e

# Generate OpenAPI spec from local server
curl -o tmp.openapi.json "http://localhost:8080/api/openapi"

# Install OpenAPI Generator if not already installed
#openapi-generator --version || brew install openapi-generator # GitHub Actions では brew が使えないため、npm を使用
openapi-typescript --version || npm install -g openapi-typescript

# Generate TypeScript Client
openapi-typescript tmp.openapi.json --output web/src/tmp-openapi.ts

# Clean up temporary files
rm tmp.openapi.json
rm web/src/openapi.ts
mv web/src/tmp-openapi.ts web/src/openapi.ts

echo "Adding generated files to git..."
git add -A web/src/openapi.ts
