FROM python:3.12-slim AS builder

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

RUN apt-get update && apt-get install -y \
    cmake \
    python3-dev \
    build-essential \
    libgl1 \
    libglib2.0-0

RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --extra cpu --frozen --no-install-project --no-editable

ADD . /app

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --extra cpu --frozen --no-editable

FROM python:3.12-slim

RUN apt-get update && apt-get install -y libgl1 libglib2.0-0

COPY --from=builder --chown=app:app /app/.venv /app/.venv
COPY --from=builder --chown=app:app /app/src /app/src

WORKDIR /app

CMD ["/app/.venv/bin/python", "/app/src/main.py"]
