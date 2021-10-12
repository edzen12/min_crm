import datetime

from rest_framework import serializers

from apps.students import choices
from apps.students.models import Student, StudentCategory
from apps.users.serializers import UserSerializer


class StudentCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentCategory
        fields = ('id', 'title')


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    klass_name = serializers.CharField(read_only=True)
    branch_name = serializers.CharField(read_only=True)

    class Meta:
        model = Student
        fields = '__all__'
        read_only_fields = ('student_id', 'user', )

    def update(self, instance, validated_data):
        data = validated_data.copy()
        status = data.get('status')
        if status:
            if status == choices.LEFT:
                data['finish_date'] = datetime.date.today()
        return super(StudentSerializer, self).update(instance, data)


class StudentDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    klass_name = serializers.CharField(read_only=True)
    branch_name = serializers.CharField(read_only=True)
    category = StudentCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Student
        fields = '__all__'
        read_only_fields = ('student_id', 'user',)
