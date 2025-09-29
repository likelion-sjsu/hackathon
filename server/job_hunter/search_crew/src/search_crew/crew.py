import os
import dotenv
from crewai import Agent, Task, Crew
from crewai.project import CrewBase, agent, crew, task
from crewai.knowledge.source.pdf_knowledge_source import PDFKnowledgeSource
from .models import JobList, MatchedJobList
from .tools.tools import web_search_tool

dotenv.load_dotenv()


@CrewBase
class JobSearchCrew():
    def __init__(self, resume_path):
        self.filename = os.path.basename(resume_path)
        self.knowledge = PDFKnowledgeSource(
            file_paths=[self.filename])

    @agent
    def job_search_agent(self):
        return Agent(
            config=self.agents_config['job_search_agent'],
            tools=[web_search_tool],
            knowledge_sources=[self.knowledge],
        )

    @agent
    def job_matching_agent(self):
        return Agent(
            config=self.agents_config['job_matching_agent'],
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
            output_pydantic=MatchedJobList,
        )

    @crew
    def job_search_crew(self):
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            # knowledge_sources=[self.knowledge],
            verbose=True,
        )
