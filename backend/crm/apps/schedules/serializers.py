from rest_framework import serializers
from apps.schedules.models import Schedule, Attendance
from apps.students.serializers import StudentSerializer


class AttendanceSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    student = StudentSerializer(read_only=True)

    class Meta:
        model = Attendance
        fields = (
            'id', 'student', 'status', 'schedule',
        )
        read_only_fields = ('schedule',)


class ScheduleSerializer(serializers.ModelSerializer):
    schedule_attendances = AttendanceSerializer(many=True, required=False)

    class Meta:
        model = Schedule
        fields = (
            'id', 'title', 'klass', 'day', 'material',
            'start_time', 'end_time', 'homework_link',
            'schedule_attendances',
        )

    def update(self, instance, validated_data):
        attendances = validated_data.pop('schedule_attendances', [])
        for attendance in attendances:
            if attendance.get('id') is not None:
                attendance_obj = Attendance.objects.get(id=attendance.get('id'))
                attendance_obj.status = attendance.get('status')
                attendance_obj.save()
        return super().update(instance, validated_data)
