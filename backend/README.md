# Backend API Server

## Getting Started
```bash
# Install dependencies
pnpm install

# Run database container
docker-compose up -d
# Enter the database container
docker-compose run cli

# Start the development server
npm run dev
# Start Firebase emulator
npm run fire:start

# Generate migration sql files
npm run db:gen
# Migrate the database
npm run db:mig

# Run tests
npm run test:unit
npm run test:integration
npm run test:coverage

# Run the linter
npm run lint
# Fix linting issues and format code
npm run fix

# Build the project
npm run build
```

## Environment Variables
```dotenv
NODE_ENV='development' # or 'production'

FIRE_SA='{"type": "service_account", "project_id": "recall-you", "private_key_id": ...}' # Download from Firebase Console (https://console.firebase.google.com/u/0/project/recall-you/settings/serviceaccounts/adminsdk)
STORAGE_CREDENTIALS='{"type": "service_account", "project_id": "recall-you", "private_key_id": ...}' # not used for now
DATABASE_URL="postgresql://postgres..." # unnecessary for development, but required for production
GEMINI_API_KEY="AIza..." # not used for now
```

## Directory Structure
```
/
├─ src
│  ├─ controller // Error handlers and logging of application services
│  ├─ db         // Database settings and schema
│  ├─ domain     // Domain models
│  ├─ infra      // Infrastructure layer (e.g., database, external services)
│  ├─ routes     // API routes (Hono.js)
│  ├─ service    // Application services
│  ├─ shared     // Shared utilities and constants
│  └─ main.ts
└─ test
   └─ unit       // Unit tests
```