set -e

# Generate OpenAPI spec from local server
curl -o tmp.openapi.json "http://localhost:8080/api/openapi"

# Install OpenAPI Generator if not already installed
openapi-generator --version || brew install openapi-generator

# Generate TypeScript Client
openapi-generator generate -i tmp.openapi.json -g typescript-axios -o web/src/api

# Clean up temporary files
rm tmp.openapi.json

echo "Adding generated files to git..."
git add -A web/src/api
