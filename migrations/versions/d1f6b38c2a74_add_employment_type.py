"""add employment type to jobs

Revision ID: d1f6b38c2a74
Revises: c7d2a91e4f63
Create Date: 2026-07-16
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "d1f6b38c2a74"
down_revision: str | None = "c7d2a91e4f63"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Add optional normalized employment metadata."""
    op.add_column("jobs", sa.Column("employment_type", sa.String(length=30), nullable=True))


def downgrade() -> None:
    """Remove optional employment metadata."""
    with op.batch_alter_table("jobs") as batch_op:
        batch_op.drop_column("employment_type")
