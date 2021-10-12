from rest_framework import serializers

from apps.branches.models import Branch
from apps.courses.serializers import CourseSerializer
from apps.users.serializers import UserSerializer


class BranchSerializer(serializers.ModelSerializer):
    administrators = UserSerializer(many=True, read_only=True)
    students = UserSerializer(many=True, read_only=True)
    trainers = UserSerializer(many=True, read_only=True)
    staffs = UserSerializer(many=True, read_only=True)
    courses = CourseSerializer(many=True, read_only=True)

    class Meta:
        model = Branch
        fields = '__all__'
