"""Atomic rendering of the database-backed four-column README table."""

from __future__ import annotations

import html
import os
from pathlib import Path

from internships.models.job import StoredJob

BEGIN_MARKER = "<!-- BEGIN INTERNSHIPS -->"
END_MARKER = "<!-- END INTERNSHIPS -->"
TABLE_HEADER = "| Company | Title | Location | Link |\n|---|---|---|---|\n"


def render_readme(path: Path, jobs: list[StoredJob]) -> None:
    """Replace exactly one generated block without touching surrounding documentation."""
    if not path.is_file():
        raise ValueError(f"README does not exist: {path}")
    content = path.read_text(encoding="utf-8")
    if content.count(BEGIN_MARKER) != 1 or content.count(END_MARKER) != 1:
        raise ValueError("README must contain exactly one internship marker pair")
    before, remainder = content.split(BEGIN_MARKER, 1)
    _old, after = remainder.split(END_MARKER, 1)
    table = markdown_table(jobs)
    _atomic_write(path, f"{before}{BEGIN_MARKER}\n{table}{END_MARKER}{after}")


def markdown_table(jobs: list[StoredJob]) -> str:
    lines = [TABLE_HEADER.rstrip("\n")]
    for job in jobs:
        lines.append(
            "| "
            + " | ".join(
                (
                    _escape(job.company),
                    _escape(job.title),
                    _escape(job.location),
                    f"[Link](<{_safe_url(job.link)}>)",
                )
            )
            + " |"
        )
    return f"{'\n'.join(lines)}\n"


def validate_readme(path: Path, jobs: list[StoredJob] | None = None) -> list[str]:
    if not path.is_file():
        return [f"README does not exist: {path}"]
    content = path.read_text(encoding="utf-8")
    errors: list[str] = []
    if content.count(BEGIN_MARKER) != 1 or content.count(END_MARKER) != 1:
        errors.append("README must contain exactly one internship marker pair")
        return errors
    block = content.split(BEGIN_MARKER, 1)[1].split(END_MARKER, 1)[0].strip()
    if not block.startswith(TABLE_HEADER.strip()):
        errors.append("README internship table must have Company, Title, Location, Link columns")
    if jobs is not None and block != markdown_table(jobs).strip():
        errors.append("README internship table does not match open jobs in SQLite")
    return errors


def _escape(value: str) -> str:
    escaped = html.escape(value.replace("\n", " "), quote=False)
    for character in ("\\", "|", "[", "]", "(", ")", "`", "*", "_"):
        escaped = escaped.replace(character, f"\\{character}")
    return escaped


def _safe_url(value: str) -> str:
    return value.replace("<", "%3C").replace(">", "%3E")


def _atomic_write(path: Path, content: str) -> None:
    temporary = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    temporary.write_text(content, encoding="utf-8", newline="\n")
    os.replace(temporary, path)
