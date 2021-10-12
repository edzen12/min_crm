from rest_framework import serializers

from apps.staffs.models import StaffMember
from apps.users.serializers import UserSerializer


class StaffSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    branch_name = serializers.CharField(read_only=True)

    class Meta:
        model = StaffMember
        fields = '__all__'
