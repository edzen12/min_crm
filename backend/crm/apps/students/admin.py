from django.contrib import admin

from apps.students.models import Student, StudentCategory

admin.site.register(Student)
admin.site.register(StudentCategory)
