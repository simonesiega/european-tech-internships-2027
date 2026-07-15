from __future__ import annotations

from internships.config.rules import ClassificationRules
from internships.models.enums import InternshipCategory
from internships.normalization.location import normalize_locations
from internships.pipeline.classification import ClassificationDecision, Classifier


def classify(
    rules: ClassificationRules,
    *,
    title: str,
    description: str = "",
    locations: list[str] | None = None,
) -> ClassificationDecision:
    return Classifier(rules, target_cycle=2027).classify(
        title=title,
        description=description,
        location=normalize_locations(locations or ["London, UK"]),
    )


def test_explicit_2027_software_internship_is_accepted(rules: ClassificationRules) -> None:
    result = classify(rules, title="Backend Software Engineering Intern 2027")
    assert result.include
    assert result.category == InternshipCategory.SOFTWARE_ENGINEERING


def test_cycle_must_be_explicit_and_not_only_graduation_year(
    rules: ClassificationRules,
) -> None:
    unknown = classify(
        rules,
        title="Software Engineering Intern",
        description="Applicants must graduate in 2027.",
    )
    class_of = classify(rules, title="Class of 2027 Software Engineering Intern")
    assert not unknown.include
    assert not class_of.include


def test_wrong_cycle_is_excluded(rules: ClassificationRules) -> None:
    result = classify(rules, title="Software Engineering Internship 2026")
    assert not result.include
    assert result.exclusion_reason == "listing is for the 2026 cycle"


def test_full_time_title_is_rejected_even_if_description_mentions_internships(
    rules: ClassificationRules,
) -> None:
    result = classify(
        rules,
        title="Senior Software Engineer 2027",
        description="Our company operates a large internship programme.",
    )
    assert not result.include
    assert result.exclusion_reason == "title does not explicitly identify an internship"


def test_senior_intern_title_is_excluded(rules: ClassificationRules) -> None:
    result = classify(rules, title="Senior Software Engineering Intern 2027")
    assert not result.include
    assert result.exclusion_reason == "title contains excluded seniority terminology"


def test_non_technology_and_non_european_jobs_are_excluded(
    rules: ClassificationRules,
) -> None:
    finance = classify(rules, title="Finance Intern 2027")
    usa = classify(
        rules,
        title="Software Engineering Intern 2027",
        locations=["New York, United States"],
    )
    assert not finance.include
    assert not usa.include


def test_description_can_classify_generic_technical_internship(
    rules: ClassificationRules,
) -> None:
    result = classify(
        rules,
        title="Technical Internship 2027",
        description="A machine learning engineering internship for summer 2027.",
    )
    assert result.include
    assert result.category == InternshipCategory.MACHINE_LEARNING
