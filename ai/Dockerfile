FROM python:3.12-slim AS builder

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

RUN apt-get update && apt-get install -y \
    cmake \
    python3-dev \
    build-essential \
    libgl1 \
    libglib2.0-0

COPY pyproject.toml uv.lock ./

RUN uv venv && \
    . .venv/bin/activate && \
    uv pip install --upgrade pip && \
    uv sync --extra cpu --frozen --no-install-project --no-editable

COPY . .

RUN . .venv/bin/activate && \
    uv sync --extra cpu --frozen --no-editable

# ───────────────────────────────────────────────

FROM python:3.12-slim

RUN apt-get update && apt-get install -y libgl1 libglib2.0-0

COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app/src /app/src

WORKDIR /app

CMD ["/app/.venv/bin/python", "/app/src/main.py"]
