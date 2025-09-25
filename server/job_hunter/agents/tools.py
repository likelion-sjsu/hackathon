import json
import os
import re
from crewai.tools import tool
from firecrawl import Firecrawl
import asyncio
from playwright.async_api import BrowserContext, async_playwright

firecrawl = Firecrawl(api_key=os.getenv("FIRECRAWL_API_KEY"))

jobs_schema = {
    "type": "object",
    "required": [],
    "properties": {
        "jobs": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "job_title": {
                        "title": "Job Title",
                        "type": "string"
                    },
                    "company_name": {
                        "title": "Company Name",
                        "type": "string"
                    },
                    "job_location": {
                        "title": "Job Location",
                        "type": "string"
                    },
                    "is_remote_friendly": {
                        "anyOf": [
                            {
                                "type": "boolean"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Is Remote Friendly"
                    },
                    "employment_type": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Employment Type"
                    },
                    "compensation": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Compensation"
                    },
                    "job_posting_url": {
                        "title": "Job Posting Url",
                        "type": "string"
                    },
                    "job_summary": {
                        "title": "Job Summary",
                        "type": "string"
                    },
                    "key_qualifications": {
                        "anyOf": [
                            {
                                "items": {
                                    "type": "string"
                                },
                                "type": "array"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Key Qualifications"
                    },
                    "job_responsibilities": {
                        "anyOf": [
                            {
                                "items": {
                                    "type": "string"
                                },
                                "type": "array"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Job Responsibilities"
                    },
                    "date_listed": {
                        "anyOf": [
                            {
                                "format": "date",
                                "type": "string"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Date Listed"
                    },
                    "required_technologies": {
                        "anyOf": [
                            {
                                "items": {
                                    "type": "string"
                                },
                                "type": "array"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Required Technologies"
                    },
                    "core_keywords": {
                        "anyOf": [
                            {
                                "items": {
                                    "type": "string"
                                },
                                "type": "array"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Core Keywords"
                    },
                    "role_seniority_level": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Role Seniority Level"
                    },
                    "years_of_experience_required": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Years Of Experience Required"
                    },
                    "minimum_education": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Minimum Education"
                    },
                    "job_benefits": {
                        "anyOf": [
                            {
                                "items": {
                                    "type": "string"
                                },
                                "type": "array"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Job Benefits"
                    },
                    "includes_equity": {
                        "anyOf": [
                            {
                                "type": "boolean"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Includes Equity"
                    },
                    "offers_visa_sponsorship": {
                        "anyOf": [
                            {
                                "type": "boolean"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Offers Visa Sponsorship"
                    },
                    "hiring_company_size": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Hiring Company Size"
                    },
                    "hiring_industry": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Hiring Industry"
                    },
                    "source_listing_url": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Source Listing Url"
                    },
                    "full_raw_job_description": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Full Raw Job Description"
                    }
                },
                "required": [
                    "job_title",
                    "company_name",
                    "job_location",
                    "job_posting_url",
                    "job_summary"
                ],
                "title": "Job"
            }
        }
    }
}
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
        # Process multiple URLs concurrently (reuse the browser)

        async def process_urls():
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                context = await browser.new_context(
                    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    viewport={'width': 1920, 'height': 1080}
                )

                tasks = [get_job_html_optimized(
                    url, browser, context) for url in job_urls]
                results = await asyncio.gather(*tasks, return_exceptions=True)

                await browser.close()
                return results

        job_html_results = asyncio.run(process_urls())

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


async def get_job_html_optimized(url: str, browser, context: BrowserContext):
    """Reuse the browser and context to get the HTML."""
    try:
        page = await context.new_page()

        # Go to the page (set the timeout to 30 seconds)
        await page.goto(url, wait_until='domcontentloaded', timeout=30000)

        # Print the page title and response status code
        # Combine the first and second divs inside job-details-scroll-container
        html = await page.get_by_test_id('job-details-scroll-container').inner_html()
        info = re.sub(r'<[^>]*>', ' ', html)

        await page.close()
        return {
            "info": info,
            "job_posting_url": url
        }

    except Exception as e:
        print(f"Failed to load {url.split('lk=')[-1]}: {e}")
        return None

# print(web_search_tool("full stack developer", "San Jose, CA"))
