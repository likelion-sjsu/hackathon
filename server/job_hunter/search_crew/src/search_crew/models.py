from typing import List, Optional
from pydantic import BaseModel
from datetime import date


class Job(BaseModel):
    job_title: str
    company_name: str
    job_location: str
    is_remote_friendly: Optional[bool] = None
    employment_type: Optional[str] = None
    compensation: Optional[str] = None
    job_posting_url: str
    job_summary: str

    key_qualifications: Optional[List[str]] = None
    job_responsibilities: Optional[List[str]] = None
    date_listed: Optional[date] = None
    required_technologies: Optional[List[str]] = None
    core_keywords: Optional[List[str]] = None

    role_seniority_level: Optional[str] = None
    years_of_experience_required: Optional[str] = None
    minimum_education: Optional[str] = None
    job_benefits: Optional[List[str]] = None
    includes_equity: Optional[bool] = None
    offers_visa_sponsorship: Optional[bool] = None
    hiring_company_size: Optional[str] = None
    hiring_industry: Optional[str] = None
    source_listing_url: Optional[str] = None
    # full_raw_job_description: Optional[str] = None


class JobList(BaseModel):
    jobs: List[Job]


class RankedJob(BaseModel):
    job: Job
    match_score: int
    reason: str


class RankedJobList(BaseModel):
    ranked_jobs: List[RankedJob]


class ChosenJob(BaseModel):
    job: Job
    selected: bool
    reason: str


class MatchedJob(BaseModel):
    job: Job
    match_score: int
    reason: str


class MatchedJobList(BaseModel):
    matched_jobs: List[MatchedJob]


class JobPostingInfo(BaseModel):
    html: str
    job_posting_url: str


class JobPostingInfoList(BaseModel):
    job_posting_infos: List[JobPostingInfo]
