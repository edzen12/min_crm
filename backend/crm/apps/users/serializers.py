from rest_framework import serializers

from django.contrib.auth import get_user_model

from utils.celery_tasks import send_password

from apps.staffs.models import StaffMember
from apps.administrators.models import Administrator
from apps.trainers.models import Trainer
from apps.students.models import Student


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    profile_id = serializers.SerializerMethodField()
    branch_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'email', 'first_name', 'avatar',
            'last_name', 'phone_number', 'second_phone_number',
            'birth_date', 'gender', 'instagram', 'facebook',
            'linkedin', 'telegram', 'is_trainer', 'is_staff_member',
            'is_administrator', 'is_student', 'profile_id', 'branch',
            'branch_name',
        )
        read_only_fields = ('id', 'user_profile', 'profile_id')

    def get_profile_id(self, obj):
        if obj.is_administrator:
            profile = Administrator.objects.get(user=obj)
        elif obj.is_trainer:
            profile = Trainer.objects.get(user=obj)
        elif obj.is_student:
            profile = Student.objects.get(user=obj)
        elif obj.is_staff_member:
            profile = StaffMember.objects.get(user=obj)
        else:
            return None
        return profile.id

    def create(self, validated_data):
        user = super().create(validated_data)
        password = User.objects.make_random_password()
        user.set_password(password)
        user.save()
        send_password.delay(user.email, password)
        return user
