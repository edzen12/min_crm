from django.contrib import admin

from apps.trainers.models import Trainer


class TrainerKlassesInline(admin.TabularInline):
    model = Trainer.klasses.through
    extra = 0


admin.site.register(Trainer)
