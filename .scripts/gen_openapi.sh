set -e

# Generate OpenAPI spec from local server
curl -o tmp.openapi.json "http://localhost:8080/api/openapi"

# Install OpenAPI Generator if not already installed
#openapi-generator --version || brew install openapi-generator # GitHub Actions では brew が使えないため、npm を使用
openapi-generator-cli version || npm install -g @openapitools/openapi-generator-cli

openapi-generator-cli version-manager set 7.13.0

# Generate TypeScript Client
openapi-generator-cli generate -i tmp.openapi.json -g typescript-axios -o web/src/openapi

# Clean up temporary files
rm tmp.openapi.json

echo "Adding generated files to git..."
git add -A web/src/openapi
