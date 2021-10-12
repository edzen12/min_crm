from django.contrib import admin
from .models import (
    Exam,
    QuestionAnswer,
    Question,
    UserExam,
    UserAnswer,
    UserCheckBoxAnswer,
)


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 0


class UserExamInline(admin.TabularInline):
    model = UserExam
    extra = 0


class QuestionAnswerInline(admin.TabularInline):
    model = QuestionAnswer
    extra = 0


class ExamAdmin(admin.ModelAdmin):
    inlines = [QuestionInline, UserExamInline]


class QuestionAdmin(admin.ModelAdmin):
    inlines = [QuestionAnswerInline]



admin.site.register(Exam, ExamAdmin)
admin.site.register(QuestionAnswer)
admin.site.register(Question, QuestionAdmin)
admin.site.register(UserExam)
admin.site.register(UserAnswer)
admin.site.register(UserCheckBoxAnswer)
