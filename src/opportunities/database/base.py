"""SQLAlchemy declarative base."""

from __future__ import annotations

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base for all migration-managed database models."""
