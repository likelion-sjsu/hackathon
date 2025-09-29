import json
import os
import re
from crewai.tools import tool
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key=os.getenv("FIRECRAWL_API_KEY"))

NUM_JOBS = 5


@tool
def web_search_tool(job_title: str, location: str):
    """
    Web Search Tool using playwright to search for job postings.
    Args:
        job_title: str
            The title of the job to search for.
            e.g.) "accounting specialist"
        location: str
            The location to search for job postings.
            e.g.) "San Jose, CA"
    Returns
        A list of search results with job posting URLs and information.
    """
    try:
        results = []
        job_urls = extract_ziprecruiter_urls(job_title, location)[:NUM_JOBS]
        for url in job_urls:
            job_html_results = get_job_markdown(url)
            results.append(job_html_results)

        # 예외가 발생한 경우를 제외하고 결과만 추가
        for result in job_html_results:
            if not isinstance(result, Exception) and result is not None:
                results.append(result)

        return results

    except Exception as e:
        print(f"Error in web_search_tool: {e}")
        return f"Error using tool: {str(e)}"


def extract_ziprecruiter_urls(job_title: str, location: str):
    """
    Crawl ZipRecruiter to search for job postings using firecrawl.
    Args:
        job_title: str
            The title of the job to search for.
        location: str
            The location to search for job postings.
    """
    j = job_title.replace(" ", "+")
    l = location.replace(" ", "+").replace(",", "%2C")
    url = f"https://www.ziprecruiter.com/jobs-search?search={j}&location={l}"

    try:
        doc = firecrawl.scrape(
            url=url,
            formats=["html"],
            max_age=3600000  # 1 hour in milliseconds
        )
        html = json.loads(doc.model_dump_json())['html']
        job_ids = re.findall(
            r'\sid="job-card-([^"]+)"', html)

        job_urls = [f"{url}&lk={job_id}" for job_id in job_ids]
        return job_urls

    except Exception as e:
        print(f"Error in extract_ziprecruiter_urls: {e}")
        return f"Error using tool: {str(e)}"


def get_job_markdown(url: str):
    """Reuse the browser and context to get the HTML."""
    try:
        doc = firecrawl.scrape(
            url=url,
            formats=["markdown"],
            max_age=3600000 * 48  # 2 days in milliseconds
        )
        markdown = json.loads(doc.model_dump_json())['markdown']
        markdown = re.sub(r'\[([^\]]*)\]\([^\)]*\)', r'\1', markdown)
        markdown = extract_titles_and_descriptions(markdown)
        markdown = markdown.replace("\n", " ")

        return {
            "markdown": markdown,
            "job_posting_url": url
        }

    except Exception as e:
        print(f"Error in extract_ziprecruiter_urls: {e}")
        return f"Error using tool: {str(e)}"


def extract_titles_and_descriptions(text):
    # 타이틀 + Job description 매칭 - 더 정확한 패턴으로 수정
    pattern = r"(## [^\n]+(?:\n[^\n#]*)*?)\s*\* \* \*\s*\n## Job description(.*?)(?=Report|\* \* \*|###|## |\\Z)"
    match = re.search(pattern, text, re.S | re.I)

    if match:
        title_section = match.group(1).strip()
        job_description = "## Job description\n" + match.group(2).strip()
        return f"{title_section}\n\n{job_description}"
    return None


# print(web_search_tool("full stack developer", "San Jose, CA"))
