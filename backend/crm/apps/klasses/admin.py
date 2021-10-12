from django.contrib import admin

from apps.klasses.models import Klass
from apps.schedules.admin import ScheduleInline
from apps.trainers.admin import TrainerKlassesInline


class KlassAdmin(admin.ModelAdmin):
    inlines = [ScheduleInline, TrainerKlassesInline]
    list_display = ('klass_id', 'base', 'branch')


admin.site.register(Klass, KlassAdmin)
