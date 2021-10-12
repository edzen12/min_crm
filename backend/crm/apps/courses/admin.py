from django.contrib import admin
from apps.courses.models import Course, CourseTag


admin.site.register(Course)
admin.site.register(CourseTag)
