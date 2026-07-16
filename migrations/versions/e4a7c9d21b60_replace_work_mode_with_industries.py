"""replace work mode with industries

Revision ID: e4a7c9d21b60
Revises: d1f6b38c2a74
Create Date: 2026-07-16
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "e4a7c9d21b60"
down_revision: str | None = "d1f6b38c2a74"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Remove workplace metadata and add optional LinkedIn industries text."""
    with op.batch_alter_table("jobs") as batch_op:
        batch_op.drop_column("work_mode")
        batch_op.add_column(sa.Column("industries", sa.String(length=500), nullable=True))


def downgrade() -> None:
    """Restore the former optional workplace metadata column."""
    with op.batch_alter_table("jobs") as batch_op:
        batch_op.drop_column("industries")
        batch_op.add_column(sa.Column("work_mode", sa.String(length=20), nullable=True))
