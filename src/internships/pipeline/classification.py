"""Strict deterministic scope checks for 2027 European technology internships."""

from __future__ import annotations

import re
from dataclasses import dataclass

from internships.config.rules import ClassificationRules
from internships.models.enums import InternshipCategory
from internships.normalization.location import EUROPEAN_COUNTRY_CODES, LocationResult
from internships.utils.text import html_to_text, normalized_key

_YEAR_RE = re.compile(r"\b20[2-4]\d\b")
_CONTEXTUAL_YEAR_RE = re.compile(
    r"(?:internship|intern|summer|placement|programme|program|cycle)\W{0,24}(20[2-4]\d)|"
    r"(20[2-4]\d)\W{0,24}(?:internship|intern|summer|placement|programme|program|cycle)"
)
_TITLE_SCOPE_NOISE = frozenset(
    {"co", "coop", "intern", "internship", "placement", "student", "summer", "university"}
)
_DESCRIPTION_CATEGORY_TITLE_WORDS = frozenset(
    {
        "ai",
        "computer",
        "data",
        "developer",
        "engineering",
        "ml",
        "research",
        "science",
        "software",
        "technical",
        "technology",
    }
)
_OTHER_TECH_KEYWORDS = (
    "computer science",
    "developer",
    "information technology",
    "technical engineering",
    "technology intern",
)


@dataclass(frozen=True, slots=True)
class ClassificationDecision:
    include: bool
    category: InternshipCategory
    exclusion_reason: str | None = None


class Classifier:
    """Accept only title-explicit internships in the target cycle and geography."""

    def __init__(self, rules: ClassificationRules, target_cycle: int) -> None:
        self.rules = rules
        self.target_cycle = target_cycle

    def classify(
        self,
        *,
        title: str,
        description: str | None,
        location: LocationResult,
    ) -> ClassificationDecision:
        title_key = normalized_key(title)
        description_key = normalized_key(html_to_text(description))

        if not self._contains_any(title_key, self.rules.internship_keywords):
            return self._exclude("title does not explicitly identify an internship")
        if self._contains_any(title_key, self.rules.excluded_role_keywords):
            return self._exclude("title contains excluded seniority terminology")

        category = self.classify_category(title_key)
        if category == InternshipCategory.UNKNOWN and self._description_can_define_category(
            title_key
        ):
            category = self.classify_category("", description_key)
        if category == InternshipCategory.UNKNOWN:
            return self._exclude("title has no technology-role signal")

        cycle = self.classify_cycle(title_key, description_key)
        if cycle != str(self.target_cycle):
            reason = (
                f"listing is for the {cycle} cycle"
                if cycle != "unknown"
                else f"internship cycle is not explicitly {self.target_cycle}"
            )
            return ClassificationDecision(False, category, reason)

        explicit_europe = bool(set(location.country_codes) & EUROPEAN_COUNTRY_CODES)
        if location.non_europe_signal and not explicit_europe:
            return ClassificationDecision(False, category, "location is outside Europe")
        if not (explicit_europe or location.europe_signal):
            return ClassificationDecision(False, category, "location is not explicitly European")

        return ClassificationDecision(True, category)

    def classify_category(self, title_key: str, description_key: str = "") -> InternshipCategory:
        for text in (title_key, description_key):
            for category, keywords in self.rules.categories.items():
                if self._contains_any(text, keywords):
                    return category
        if self._contains_any(f"{title_key} {description_key}", _OTHER_TECH_KEYWORDS):
            return InternshipCategory.OTHER_TECH
        return InternshipCategory.UNKNOWN

    def classify_cycle(self, title_key: str, description_key: str) -> str:
        title_years = [
            match.group()
            for match in _YEAR_RE.finditer(title_key)
            if not _is_eligibility_year(title_key, match.start())
        ]
        target = str(self.target_cycle)
        if target in title_years:
            return target
        if title_years:
            return title_years[0]
        contextual_years: list[str] = []
        for match in _CONTEXTUAL_YEAR_RE.finditer(description_key):
            group = 1 if match.group(1) else 2
            if not _is_eligibility_year(description_key, match.start(group)):
                contextual_years.append(str(match.group(group)))
        if target in contextual_years:
            return target
        return contextual_years[0] if contextual_years else "unknown"

    @staticmethod
    def _description_can_define_category(title_key: str) -> bool:
        words = {word for word in set(title_key.split()) - _TITLE_SCOPE_NOISE if not word.isdigit()}
        return not words or words <= _DESCRIPTION_CATEGORY_TITLE_WORDS

    def _contains_any(self, text: str, keywords: tuple[str, ...]) -> bool:
        return any(_contains_phrase(text, normalized_key(keyword)) for keyword in keywords)

    @staticmethod
    def _exclude(reason: str) -> ClassificationDecision:
        return ClassificationDecision(False, InternshipCategory.UNKNOWN, reason)


def _contains_phrase(text: str, phrase: str) -> bool:
    return bool(phrase and re.search(rf"(?:^|\s){re.escape(phrase)}(?:$|\s)", text))


def _is_eligibility_year(text: str, year_start: int) -> bool:
    prefix = text[max(0, year_start - 40) : year_start]
    return bool(re.search(r"(?:class\s+of|graduat\w*)(?:\s+\w+){0,4}\s*$", prefix))
