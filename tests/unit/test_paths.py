from pathlib import Path

from opportunities.utils.paths import find_project_root


def test_find_project_root_is_independent_of_directory_depth(tmp_path: Path) -> None:
    root = tmp_path / "renamed-project"
    (root / "migrations").mkdir(parents=True)
    (root / "pyproject.toml").touch()
    (root / "alembic.ini").touch()
    nested_file = root / "any" / "future" / "layout" / "module.py"
    nested_file.parent.mkdir(parents=True)
    nested_file.touch()

    assert find_project_root(nested_file) == root
