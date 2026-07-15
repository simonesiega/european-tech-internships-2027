from __future__ import annotations

import asyncio
import os

import pytest

from internships.config.search_registry import load_search_registry
from internships.config.settings import Settings
from internships.scrapers.http import HttpFetcher
from internships.scrapers.linkedin import LinkedInScraper
from tests.conftest import ROOT

pytestmark = [
    pytest.mark.live,
    pytest.mark.skipif(
        os.getenv("INTERNSHIPS_LIVE_TESTS") != "1"
        or os.getenv("INTERNSHIPS_LINKEDIN_CRAWL_AUTHORIZED") != "true",
        reason=(
            "live test requires INTERNSHIPS_LIVE_TESTS=1 and documented LinkedIn crawl permission"
        ),
    ),
]


def test_public_linkedin_search_and_detail_are_reachable() -> None:
    configured = load_search_registry(ROOT / "configs" / "searches", enabled_only=True)[0]
    search = configured.model_copy(update={"max_pages": 1, "max_results": 1})
    settings = Settings(
        rate_limit_seconds=0,
        max_retries=1,
        linkedin_crawl_authorized=True,
    )

    async def run() -> None:
        async with HttpFetcher(settings) as fetcher:
            result = await LinkedInScraper().scrape(search, fetcher)
        assert result.pages_fetched == 1
        assert result.search_result_count >= 1
        assert len(result.positions) == 1

    asyncio.run(run())
