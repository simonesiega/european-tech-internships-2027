from __future__ import annotations

import asyncio

import httpx
import pytest

from internships.config.settings import Settings
from internships.scrapers.http import FetchError, HttpFetcher


def test_linkedin_http_is_blocked_without_explicit_authorization() -> None:
    settings = Settings(rate_limit_seconds=0)

    async def run() -> None:
        async with HttpFetcher(settings) as fetcher:
            with pytest.raises(FetchError, match="express permission"):
                await fetcher.get_text("https://www.linkedin.com/jobs-guest/jobs/api/search")

    asyncio.run(run())


def test_http_fetcher_retries_transient_linkedin_response() -> None:
    attempts = 0

    def handler(request: httpx.Request) -> httpx.Response:
        nonlocal attempts
        attempts += 1
        if attempts == 1:
            return httpx.Response(503, text="temporary", request=request)
        return httpx.Response(
            200,
            text="<li>ok</li>",
            request=request,
            headers={"content-type": "text/html; charset=utf-8"},
        )

    client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    settings = Settings(
        rate_limit_seconds=0,
        retry_backoff_seconds=0,
        max_retries=2,
        linkedin_crawl_authorized=True,
    )

    async def run() -> str:
        async with client:
            response = await HttpFetcher(settings, client=client).get_text(
                "https://www.linkedin.com/jobs-guest/jobs/api/search"
            )
            return response.text

    assert asyncio.run(run()) == "<li>ok</li>"
    assert attempts == 2


def test_http_fetcher_honors_429_retry_after() -> None:
    attempts = 0
    delays: list[float] = []

    def handler(request: httpx.Request) -> httpx.Response:
        nonlocal attempts
        attempts += 1
        if attempts == 1:
            return httpx.Response(
                429,
                text="rate limited",
                request=request,
                headers={"retry-after": "2"},
            )
        return httpx.Response(
            200,
            text="<html></html>",
            request=request,
            headers={"content-type": "text/html"},
        )

    async def sleep(delay: float) -> None:
        delays.append(delay)

    client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    settings = Settings(
        rate_limit_seconds=0,
        retry_backoff_seconds=0,
        max_retries=1,
        linkedin_crawl_authorized=True,
    )

    async def run() -> None:
        async with client:
            await HttpFetcher(settings, client=client, sleep=sleep).get_text(
                "https://www.linkedin.com/jobs-guest/jobs/api/search"
            )

    asyncio.run(run())
    assert attempts == 2
    assert 2.0 in delays


def test_http_fetcher_rejects_non_html_response() -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200,
            json={"jobs": []},
            request=request,
            headers={"content-type": "application/json"},
        )

    client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    settings = Settings(rate_limit_seconds=0, max_retries=0, linkedin_crawl_authorized=True)

    async def run() -> None:
        async with client:
            with pytest.raises(FetchError, match="did not return HTML"):
                await HttpFetcher(settings, client=client).get_text(
                    "https://www.linkedin.com/jobs-guest/jobs/api/search"
                )

    asyncio.run(run())


def test_http_fetcher_enforces_response_size_limit() -> None:
    body = ("<html>" + ("x" * 20_000) + "</html>").encode()

    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200,
            content=body,
            request=request,
            headers={"content-type": "text/html", "content-length": str(len(body))},
        )

    client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
    settings = Settings(
        rate_limit_seconds=0,
        max_retries=0,
        max_response_bytes=10_000,
        linkedin_crawl_authorized=True,
    )

    async def run() -> None:
        async with client:
            with pytest.raises(FetchError, match="size limit"):
                await HttpFetcher(settings, client=client).get_text(
                    "https://www.linkedin.com/jobs-guest/jobs/api/search"
                )

    asyncio.run(run())
