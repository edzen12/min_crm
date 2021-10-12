from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import action

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from django.db.models import Count, Sum, Case, IntegerField, When, F
from django.db.models.functions import ExtractYear

from apps.students.models import Student
from apps.students.choices import STUDENT_STATUS_CHOICES
from apps.courses.models import Course
from apps.klasses.models import Klass
from apps.branches.models import Branch

from apps.analytics.serializers.students import (
    StudentsStatusesSerializer,
    StudentsStatusesYearsSerializer, 
    StudentsStatusesBranchSerializer,
    StudentsStatusesBranchYearSerializer, 
    StudentsBranchSerializer, 
    StudentsBranchYearsSerializer, 
    StudentsCoursesSerializer, 
    StudentsCoursesYearSerializer, 
    StudentsActiveCoursesSerializer, 
    YearStudentsCountSerializer, 
    StudentsEmployedSerializer, 
    StudentsReferralsSerializer, 
)


def response_example(serializer, description=''):
    return openapi.Response(description, serializer)


class StudentsAnalyticsViewSet(viewsets.ViewSet):
    @swagger_auto_schema(
        responses={
            200: response_example(
                StudentsStatusesSerializer, 
                description='Кол-во студентов за ВСЁ ВРЕМЯ со статусами'
            )
        }
    )
    @action(detail=False, url_path='students-statuses-all')
    def students_statuses_all(self, request):
        students = Student.objects.values('status').\
                   annotate(count=Count('status')).\
                   order_by('status')
        return Response(students)

    @swagger_auto_schema(
        responses={
            200: response_example(
                StudentsStatusesYearsSerializer, 
                description='Кол-во студентов по годам со статусами'
            )
        }
    )
    @action(detail=False, url_path='students-statuses-years')
    def students_statuses_years(self, request):
        active = Student.objects.filter(status=STUDENT_STATUS_CHOICES[0][0]).\
                 annotate(year=ExtractYear('enrollment_date')).\
                 values('year').annotate(count=Count('id')).order_by('year')

        graduated = Student.objects.filter(status=STUDENT_STATUS_CHOICES[2][0]).\
                         annotate(year=ExtractYear('finish_date')).\
                         values('year').annotate(count=Count('id')).order_by('year')

        left = Student.objects.filter(status=STUDENT_STATUS_CHOICES[1][0]).\
                    annotate(year=ExtractYear('finish_date')).\
                    values('year').annotate(count=Count('id')).order_by('year')
        data = {
            'active': active,
            'graduated': graduated,
            'left': left
        }
        return Response(data)

    @swagger_auto_schema(
        responses={
            200: response_example(
                StudentsStatusesBranchSerializer,
                description='Кол-во студентов за всё время по филлиалам со статусами'
            )
        }
    )
    @action(detail=False, url_path='students-statuses-all-branch')
    def students_statuses_all_branch(self, request):
        branches = Branch.objects.annotate(
                        active=Count(Case(When(users__student__status=STUDENT_STATUS_CHOICES[0][0], then=1), output_field=IntegerField())),
                        graduated=Count(Case(When(users__student__status=STUDENT_STATUS_CHOICES[2][0], then=1), output_field=IntegerField())),
                        left=Count(Case(When(users__student__status=STUDENT_STATUS_CHOICES[1][0], then=1), output_field=IntegerField()))
                    ).values('name', 'active', 'graduated', 'left')
        return Response(branches)

    @swagger_auto_schema(
        responses={
            200: response_example(
                StudentsStatusesBranchYearSerializer,
                description='Кол-во студентов за всё время по годам и филлиалам со статусами'
            )
        }
    )
    @action(detail=False, url_path='students-statuses-years-branch')
    def students_statuses_years_branch(self, request):
        branches = Branch.objects.annotate(year=ExtractYear('users__student__enrollment_date')).\
                    annotate(
                        active=Count(Case(When(users__student__status=STUDENT_STATUS_CHOICES[0][0], then=1), output_field=IntegerField())),
                        graduated=Count(Case(When(users__student__status=STUDENT_STATUS_CHOICES[2][0], then=1), output_field=IntegerField())),
                        left=Count(Case(When(users__student__status=STUDENT_STATUS_CHOICES[1][0], then=1), output_field=IntegerField())),

                    ).values('name', 'year', 'active', 'graduated', 'left')
        return Response(branches)

    @swagger_auto_schema(
        responses={
            200: response_example(
                StudentsBranchSerializer,
                description='Кол-во студентов за всё время по филлиалам'
            )
        }
    )
    @action(detail=False, url_path='students-branch-all')
    def students_branch_all(self, request):
        branches = Branch.objects.annotate(count=Count('users__student')).\
                   values('count', 'name')
        return Response(branches)

    @swagger_auto_schema(
        responses={
            200: response_example(
                StudentsBranchYearsSerializer,
                description='Кол-во студентов за всё время по годам и филлиалам'
            )
        }
    )
    @action(detail=False, url_path='students-branch-years')
    def students_branch_years(self, request):
        branches = Branch.objects.annotate(count=Count('users__student')).\
                   annotate(year=ExtractYear('users__student__enrollment_date')).\
                   values('count', 'year', 'name')
        return Response(branches)

    @swagger_auto_schema(
        responses={
            200: response_example(
                StudentsCoursesSerializer, 
                description='Кол-во студентов за всё время по направлениям'
            )
        }
    )
    @action(detail=False, url_path='students-courses-all')
    def students_courses_all(self, request):
        courses = Course.objects.annotate(count=Count('klasses__students')).\
                  values('count', 'title')
        return Response(courses)

    @swagger_auto_schema(
        responses={
            200: response_example(
                StudentsCoursesYearSerializer, 
                description='Кол-во студентов по годам и направлениям'
            )
        }
    )
    @action(detail=False, url_path='students-courses-years')
    def students_courses_years(self, request):
        courses = Course.objects.annotate(count=Count('klasses__students')).\
                  annotate(year=ExtractYear('klasses__students__enrollment_date')).\
                  values('count', 'title', 'year')
        return Response(courses)

    @swagger_auto_schema(
        responses={
            200: response_example(
                StudentsActiveCoursesSerializer, 
                description='Кол-во активных студентов по направлениям'
            )
        }
    )
    @action(detail=False, url_path='students-active-courses')
    def students_active_courses(self, request):
        courses = Course.objects.annotate(
            active=Count(Case(When(klasses__students__status=STUDENT_STATUS_CHOICES[0][0], then=1), output_field=IntegerField()))
        ).values('title', 'active')
        return Response(courses)

    @swagger_auto_schema(
        responses={200: response_example(
            YearStudentsCountSerializer, 
            description='Кол-во студентов по годам'
        )}
    )
    @action(detail=False, url_path='students-amount-years')
    def students_amount_years(self, request):
        students = Student.objects.annotate(year=ExtractYear('enrollment_date')).\
                   values('year').annotate(count=Count('id')).order_by('year')
        return Response(students)

    @swagger_auto_schema(
        responses={200: response_example(
            StudentsEmployedSerializer, 
            description='Кол-во трудоустроенных за всё время и по годам'
        )}
    )
    @action(detail=False, url_path='students-employed')
    def students_employed(self, request):
        employed_count = Student.objects.filter(place_of_work__isnull=False).count()
        employed = Student.objects.filter(place_of_work__isnull=False).\
                   annotate(year=ExtractYear('enrollment_date')).\
                   values('year').annotate(count=Count('id')).order_by('year')
        data = {
            'employed_count': employed_count,
            'employed': employed
        }
        return Response(data)

    @swagger_auto_schema(
        responses={200: response_example(
            StudentsReferralsSerializer, 
            description='рефералы студентов'
        )}
    )
    @action(detail=False, url_path='students-referral')
    def students_referral(self, request):
        students = Student.objects.values('info_from').\
                   annotate(count=Count('info_from')).order_by('info_from')
        return Response(students)

    @swagger_auto_schema(
        responses={200: response_example(
            StudentsCoursesSerializer, 
            description='пол'
        )}
    )
    @action(detail=False, url_path='students-gender')
    def students_gender(self, request):
        students = Student.objects.annotate(title=F('user__gender')).\
                   values('title').annotate(gender=Count('user__gender')).\
                   order_by('user__gender')
        return Response(students)
