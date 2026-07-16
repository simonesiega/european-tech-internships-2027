"""add work mode and start date to jobs

Revision ID: c7d2a91e4f63
Revises: 8b4e2f3a1c90
Create Date: 2026-07-16
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "c7d2a91e4f63"
down_revision: str | None = "8b4e2f3a1c90"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Add nullable metadata because public listings may omit either field."""
    op.add_column("jobs", sa.Column("work_mode", sa.String(length=20), nullable=True))
    op.add_column("jobs", sa.Column("start_date", sa.String(length=100), nullable=True))


def downgrade() -> None:
    """Remove the optional job metadata columns."""
    with op.batch_alter_table("jobs") as batch_op:
        batch_op.drop_column("start_date")
        batch_op.drop_column("work_mode")
