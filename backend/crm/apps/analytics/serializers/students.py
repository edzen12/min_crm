from rest_framework import serializers

from apps.students.choices import (
    STUDENT_STATUS_CHOICES,
    INFO_FROM_CHOICES, 
)


class StudentsStatusesSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=STUDENT_STATUS_CHOICES)
    count = serializers.IntegerField()


class YearStudentsCountSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    count = serializers.IntegerField()


class StudentsStatusesYearsSerializer(serializers.Serializer):
    active = YearStudentsCountSerializer(many=True)
    graduated = YearStudentsCountSerializer(many=True)
    left = YearStudentsCountSerializer(many=True)


class StudentsStatusesBranchSerializer(serializers.Serializer):
    name = serializers.CharField()
    active = serializers.IntegerField()
    graduated = serializers.IntegerField()
    left = serializers.IntegerField()


class StudentsStatusesBranchYearSerializer(StudentsStatusesBranchSerializer):
    year = serializers.IntegerField()


class StudentsBranchSerializer(serializers.Serializer):
    name = serializers.CharField()
    count = serializers.IntegerField()


class StudentsBranchYearsSerializer(StudentsBranchSerializer):
    year = serializers.IntegerField()


class StudentsCoursesSerializer(serializers.Serializer):
    title = serializers.CharField()
    count = serializers.CharField()


class StudentsCoursesYearSerializer(StudentsCoursesSerializer):
    year = serializers.IntegerField()


class StudentsActiveCoursesSerializer(serializers.Serializer):
    title = serializers.CharField()
    active = serializers.IntegerField()


class StudentsEmployedSerializer(serializers.Serializer):
    employed_count = serializers.IntegerField()
    employed = YearStudentsCountSerializer(many=True)


class StudentsReferralsSerializer(serializers.Serializer):
    info_from = serializers.ChoiceField(choices=INFO_FROM_CHOICES)
    count = serializers.CharField()