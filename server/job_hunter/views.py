from rest_framework.views import APIView
from rest_framework.response import Response
from job_hunter.agents.search_agent import JobSearchCrew
from job_hunter.agents.prepare_agent import JobPrepareCrew
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, parser_classes
import json
import os
from django.conf import settings


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def job_hunter_view(request):
    data = request.data
    position = data.get("position")
    location = data.get("location")
    resume = data.get("resume")

    # Save resume if provided
    saved_resume_path = None
    if resume:
        try:
            saved_resume_path = save_resume(resume)
            print(f"Resume saved successfully at: {saved_resume_path}")
        except Exception as e:
            return Response(status=500, data={"error": str(e)})
    else:
        return Response(status=400, data={"error": "No resume file provided"})

    try:
        jobs_searched = JobSearchCrew(saved_resume_path).job_search_crew().kickoff(inputs={
            'position': position,
            'location': location,
        })
    except Exception as e:
        return Response(status=500, data={"error": str(e)})

    # JSON 문자열을 파싱하여 matched_jobs 배열만 추출
    result_data = json.loads(jobs_searched.pydantic.model_dump_json())
    matched_jobs = result_data.get('matched_jobs', [])

    return Response(matched_jobs)


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def job_prepare_view(request):
    try:
        data = request.data
        job = json.loads(data.get("job"))
        resume_file_name = data.get("resume_file_name")

        JobPrepareCrew(resume_file_name).job_prepare_crew().kickoff(inputs={
            'ChosenJob': job,
        })
        return Response(status=200, data={"directory": f"/{resume_file_name.split('.')[0]}"})
    except Exception as e:
        return Response(status=500, data={"error": str(e)})


def save_resume(resume):
    """
    Save uploaded resume file to the knowledge directory with timestamped filename.

    Args:
        resume: Uploaded file object from Django request

    Returns:
        str: Path to the saved file
    """
    # Create knowledge directory if it doesn't exist
    knowledge_dir = os.path.join(settings.BASE_DIR, "knowledge")
    os.makedirs(knowledge_dir, exist_ok=True)

    # Get the original filename from the uploaded file
    filename = resume.name if hasattr(resume, 'name') else 'resume.pdf'

    # Save with the timestamped filename
    file_path = os.path.join(knowledge_dir, filename)

    with open(file_path, "wb") as f:
        for chunk in resume.chunks():
            f.write(chunk)

    return file_path


@api_view(["GET"])
def get_files_by_id(request, file_id):
    """Get all markdown files for a specific session ID"""
    try:
        output_dir = os.path.join(settings.BASE_DIR, "output", file_id)

        if not os.path.exists(output_dir):
            return Response({"files": []})

        files = []
        for filename in os.listdir(output_dir):
            if filename.endswith('.md'):
                file_path = os.path.join(output_dir, filename)
                files.append({
                    "name": filename,
                    "path": file_path,
                    "relative_path": f"output/{file_id}/{filename}"
                })

        return Response(files)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
def get_file_content(request):
    """Get content of a specific file"""
    try:
        file_path = request.GET.get('path')
        if not file_path:
            return Response({"error": "Path parameter required"}, status=400)

        # Security check - ensure path is within output directory
        output_dir = os.path.join(settings.BASE_DIR, "output")
        full_path = os.path.join(settings.BASE_DIR, file_path)

        if not full_path.startswith(output_dir):
            return Response({"error": "Invalid file path"}, status=403)

        if not os.path.exists(full_path):
            return Response({"error": "File not found"}, status=404)

        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Return content as plain text for the frontend
        from django.http import HttpResponse
        return HttpResponse(content, content_type='text/plain')
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
def save_file_content(request):
    """Save content to a specific file"""
    try:
        data = json.loads(request.body)
        file_path = data.get('filePath')
        content = data.get('content')

        if not file_path or content is None:
            return Response({"error": "filePath and content required"}, status=400)

        # Security check - ensure path is within output directory
        output_dir = os.path.join(settings.BASE_DIR, "output")
        full_path = os.path.join(settings.BASE_DIR, file_path)

        if not full_path.startswith(output_dir):
            return Response({"error": "Invalid file path"}, status=403)

        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return Response({"success": True, "message": "File saved successfully"})
    except Exception as e:
        return Response({"error": str(e)}, status=500)
