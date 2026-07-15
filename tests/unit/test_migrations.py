from pathlib import Path
from unittest.mock import patch

from internships.database.migrations import upgrade_database
from internships.utils.paths import find_project_root

ROOT = find_project_root(Path(__file__))


def test_upgrade_database_verifies_second_upgrade_is_a_no_op() -> None:
    with patch("internships.database.migrations.command.upgrade") as upgrade:
        upgrade_database("sqlite:///data/test.db", repository_root=ROOT)

    assert upgrade.call_count == 2
    first_config, first_revision = upgrade.call_args_list[0].args
    second_config, second_revision = upgrade.call_args_list[1].args
    assert second_config is first_config
    assert first_revision == second_revision == "head"
