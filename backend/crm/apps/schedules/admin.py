from django.contrib import admin

from apps.schedules.models import Schedule, Attendance


class ScheduleInline(admin.TabularInline):
    model = Schedule
    extra = 0


admin.site.register(Schedule)
admin.site.register(Attendance)
