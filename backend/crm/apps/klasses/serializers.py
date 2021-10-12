from rest_framework import serializers

from apps.klasses.models import Klass
from apps.students.models import Student
from apps.students.serializers import StudentSerializer
from apps.trainers.models import Trainer
from apps.schedules.serializers import ScheduleSerializer
from apps.courses.serializers import CourseSerializer
from apps.trainers.serializers import TrainerSerializer


class KlassSerializer(serializers.ModelSerializer):
    schedules = ScheduleSerializer(many=True, read_only=True)
    trainers = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Trainer.objects.all()
    )
    students = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Student.objects.all()
    )

    class Meta:
        model = Klass
        fields = (
            'id', 'klass_id', 'classroom_link', 'course',
            'schedules', 'trainers', 'students', 'base',
            'branch',
        )
        read_only_fields = ('klass_id', )


class KlassGetSerializer(serializers.ModelSerializer):
    schedules = ScheduleSerializer(many=True, read_only=True)
    trainers = TrainerSerializer(many=True, read_only=True)
    students = StudentSerializer(many=True, read_only=True)
    course = CourseSerializer(read_only=True)
    branch_name = serializers.CharField(read_only=True)

    class Meta:
        model = Klass
        fields = (
            'id', 'klass_id', 'classroom_link', 'course',
            'schedules', 'trainers', 'students', 'base',
            'branch', 'branch_name',
        )
        read_only_fields = fields
