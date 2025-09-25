import os
import dotenv
from crewai import Agent, Task, Crew
from crewai.project import CrewBase, agent, crew, task
from crewai.knowledge.source.pdf_knowledge_source import PDFKnowledgeSource
from .models import JobList, MatchedJobList, JobPostingInfoList
from .tools import web_search_tool

dotenv.load_dotenv()


@CrewBase
class JobSearchCrew():
    def __init__(self, resume_path):
        self.resume_path = resume_path

        # Get just the filename from the absolute path
        filename = os.path.basename(resume_path)
        self.resume_knowledge = PDFKnowledgeSource(
            file_paths=[filename]
        )

    @agent
    def job_search_agent(self):
        return Agent(
            config=self.agents_config['job_search_agent'],
            tools=[web_search_tool]
        )

    @agent
    def job_matching_agent(self):
        return Agent(
            config=self.agents_config['job_matching_agent'],
            knowledge_sources=[self.resume_knowledge]
        )

    @agent
    def resume_optimization_agent(self):
        return Agent(
            config=self.agents_config['resume_optimization_agent'],
            knowledge_sources=[self.resume_knowledge]
        )

    @agent
    def company_research_agent(self):
        return Agent(
            config=self.agents_config['company_research_agent'],
            knowledge_sources=[self.resume_knowledge],
            tools=[web_search_tool]
        )

    @agent
    def interview_prep_agent(self):
        return Agent(
            config=self.agents_config['interview_prep_agent'],
            knowledge_sources=[self.resume_knowledge]
        )

    @task
    def job_extraction_task(self):
        return Task(
            config=self.tasks_config['job_extraction_task'],
            tools=[web_search_tool],
            output_pydantic=JobList,
        )

    @task
    def job_matching_task(self):
        return Task(
            config=self.tasks_config['job_matching_task'],
            output_pydantic=MatchedJobList
        )

    @crew
    def job_search_crew(self):
        return Crew(
            agents=[self.job_search_agent(), self.job_matching_agent()],
            tasks=[self.job_extraction_task(), self.job_matching_task()],
            verbose=False,
        )
