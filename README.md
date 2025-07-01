# WhatWeTalked
WhatWeTalked is an app for AI Agent Hackathon by Zenn 2025.

## Getting Started
### ML サーバー
ai/ ディレクトリ内で以下のコードを実行
```
apt install cmake
brew install cmake
uv venv
source .venv/bin/activate

uv pip install '.[cpu]' # for CPU
uv pip install '.[gpu]' # for GPU

uv sync --extra cpu # for CPU
uv sync --extra gpu # for GPU

uv run src/main.py
```

## Backend サーバー
backend/ ディレクトリ内で以下のコードを実行
```
pnpm install
npm run dev

npm run fire:start

docker-compose up -d
```

## Web サーバー
web/ ディレクトリ内で以下のコードを実行
```
pnpm install
npm run dev
```

## Firebase
firebase/functions/generate_profile/.env.local をどうディレクトリの .env を参考に設定

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- pnpm
- Docker (for backend development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-agent-hack-1
   ```

2. **Install dependencies**
   ```bash
   # Install web frontend dependencies
   cd web
   pnpm install
   
   # Install backend dependencies
   cd ../backend
   pnpm install
   ```

3. **Start development servers**
   ```bash
   # Start backend (in backend directory)
   cd backend
   pnpm run dev
   
   # Start web frontend (in web directory)
   cd web
   pnpm run dev
   ```

## Directory Structure
```
├── ai      // 顔認証サーバー
├── backend // Web API サーバー
├── web     // Web フロントエンド
└── README.md
```

## Git rules
- Branch naming convention:
  - `main`: The main branch for production.
  - `<username>/<short-description>`: Feature branches for development.
- Commit messages: free format, but should be descriptive.
