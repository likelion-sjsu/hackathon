import os
import dotenv
from crewai import Agent, Task, Crew
from crewai.project import CrewBase, agent, crew, task
from crewai.knowledge.source.pdf_knowledge_source import PDFKnowledgeSource
from .models import JobList, MatchedJobList, ChosenJob
from .tools import web_search_tool

dotenv.load_dotenv()


@CrewBase
class JobPrepareCrew():
    def __init__(self, resume_file_name):
        self.resume_file_name = resume_file_name
        self.resume_knowledge = PDFKnowledgeSource(
            file_paths=[resume_file_name]
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
            knowledge_sources=[self.resume_knowledge],
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
            knowledge_sources=[self.resume_knowledge],
        )

    @task
    def resume_rewriting_task(self):
        return Task(
            config=self.tasks_config['resume_rewriting_task'],
            output_file=f"output/{self.resume_file_name.split('.')[0]}/rewritten_resume.md"
        )

    @task
    def company_research_task(self):
        return Task(
            config=self.tasks_config['company_research_task'],
            output_file=f"output/{self.resume_file_name.split('.')[0]}/company_research.md"
        )

    @task
    def interview_prep_task(self):
        return Task(
            config=self.tasks_config['interview_prep_task'],
            context=[
                self.resume_rewriting_task(),
                self.company_research_task(),
            ],
            output_file=f"output/{self.resume_file_name.split('.')[0]}/interview_prep.md"
        )

    @crew
    def job_prepare_crew(self):
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            verbose=False,
        )
