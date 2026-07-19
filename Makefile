.PHONY: install lock migrate scrape render validate searches stats lint format typecheck test test-live migrations docs check

install:
	uv sync --dev

lock:
	uv lock --check

migrate:
	uv run opportunities db-upgrade

scrape:
	uv run opportunities scrape

render:
	uv run opportunities render

validate:
	uv run opportunities validate

searches:
	uv run opportunities searches

stats:
	uv run opportunities stats

lint:
	uv run ruff format --check .
	uv run ruff check .

format:
	uv run ruff format .
	uv run ruff check --fix .

typecheck:
	uv run mypy src tests scripts

test:
	uv run pytest -m "not live"

test-live:
	uv run pytest -m "live"

migrations:
	uv run python scripts/check_migrations.py

docs:
	uv run python scripts/check_docs.py

check: lock lint typecheck test migrations docs
