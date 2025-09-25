from django.urls import path
from .views import (
    job_hunter_view,
    job_prepare_view,
    get_files_by_id,
    get_file_content,
    save_file_content
)

urlpatterns = [
    path('crawl/', job_hunter_view, name='job-hunter'),
    path('prepare/', job_prepare_view, name='job-prepare'),
    path('files/<str:file_id>/', get_files_by_id, name='get-files'),
    path('file-content/', get_file_content, name='get-file-content'),
    path('save-file/', save_file_content, name='save-file'),
]
