"""Small, deterministic text-cleaning helpers."""

from __future__ import annotations

import html
import re
import unicodedata

from bs4 import BeautifulSoup

_WHITESPACE_RE = re.compile(r"\s+")
_NON_WORD_RE = re.compile(r"[^a-z0-9]+")


def clean_text(value: str | None) -> str:
    if not value:
        return ""
    return _WHITESPACE_RE.sub(" ", html.unescape(value)).strip()


def html_to_text(value: str | None) -> str:
    if not value:
        return ""
    soup = BeautifulSoup(value, "html.parser")
    return clean_text(soup.get_text(" ", strip=True))


def normalized_key(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", clean_text(value)).encode("ascii", "ignore").decode()
    return _NON_WORD_RE.sub(" ", decomposed.lower()).strip()


def truncate(value: str, maximum: int) -> str:
    cleaned = clean_text(value)
    if len(cleaned) <= maximum:
        return cleaned
    clipped = cleaned[: maximum - 1].rsplit(" ", 1)[0].rstrip(" ,.;:")
    return f"{clipped or cleaned[: maximum - 1]}…"
