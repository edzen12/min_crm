from rest_framework import serializers

from apps.courses.models import Course, CourseTag


class CourseTagSerializer(serializers.ModelSerializer):

    class Meta:
        model = CourseTag
        fields = ('id', 'title')


class CourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = '__all__'


class CourseListSerializer(serializers.ModelSerializer):
    tags = CourseTagSerializer(many=True, read_only=True)
    branch_name = serializers.CharField(read_only=True)

    class Meta:
        model = Course
        fields = '__all__'
