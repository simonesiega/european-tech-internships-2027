"""add canonical state constraints

Revision ID: a9c4e72b5d18
Revises: f2b8d4c61a90
Create Date: 2026-07-20
"""

from collections.abc import Sequence

from alembic import op

revision: str = "a9c4e72b5d18"
down_revision: str | None = "f2b8d4c61a90"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Constrain statuses, counters, and observation timestamp ordering."""
    with op.batch_alter_table("jobs") as batch_op:
        batch_op.create_check_constraint(
            "ck_jobs_status",
            "status IN ('open', 'closed')",
        )
        batch_op.create_check_constraint(
            "ck_jobs_seen_at_order",
            "last_seen_at >= first_seen_at",
        )

    with op.batch_alter_table("search_runs") as batch_op:
        batch_op.create_check_constraint(
            "ck_search_runs_status",
            "status IN ('success', 'failed')",
        )
        batch_op.create_check_constraint(
            "ck_search_runs_duration_ms_nonnegative",
            "duration_ms >= 0",
        )
        batch_op.create_check_constraint(
            "ck_search_runs_found_count_nonnegative",
            "found_count >= 0",
        )
        batch_op.create_check_constraint(
            "ck_search_runs_accepted_count_nonnegative",
            "accepted_count >= 0",
        )
        batch_op.create_check_constraint(
            "ck_search_runs_excluded_count_nonnegative",
            "excluded_count >= 0",
        )
        batch_op.create_check_constraint(
            "ck_search_runs_warning_count_nonnegative",
            "warning_count >= 0",
        )

    with op.batch_alter_table("job_searches") as batch_op:
        batch_op.create_check_constraint(
            "ck_job_searches_unavailable_confirmations_nonnegative",
            "unavailable_confirmations >= 0",
        )
        batch_op.create_check_constraint(
            "ck_job_searches_seen_at_order",
            "last_seen_at >= first_seen_at",
        )


def downgrade() -> None:
    """Remove canonical state check constraints."""
    with op.batch_alter_table("job_searches") as batch_op:
        batch_op.drop_constraint(
            "ck_job_searches_seen_at_order",
            type_="check",
        )
        batch_op.drop_constraint(
            "ck_job_searches_unavailable_confirmations_nonnegative",
            type_="check",
        )

    with op.batch_alter_table("search_runs") as batch_op:
        batch_op.drop_constraint("ck_search_runs_warning_count_nonnegative", type_="check")
        batch_op.drop_constraint("ck_search_runs_excluded_count_nonnegative", type_="check")
        batch_op.drop_constraint("ck_search_runs_accepted_count_nonnegative", type_="check")
        batch_op.drop_constraint("ck_search_runs_found_count_nonnegative", type_="check")
        batch_op.drop_constraint("ck_search_runs_duration_ms_nonnegative", type_="check")
        batch_op.drop_constraint("ck_search_runs_status", type_="check")

    with op.batch_alter_table("jobs") as batch_op:
        batch_op.drop_constraint("ck_jobs_seen_at_order", type_="check")
        batch_op.drop_constraint("ck_jobs_status", type_="check")
