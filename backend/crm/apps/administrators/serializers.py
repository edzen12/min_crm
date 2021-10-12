from rest_framework import serializers

from apps.users.serializers import UserSerializer

from apps.administrators.models import Administrator


class AdministratorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    branch_name = serializers.CharField(read_only=True)

    class Meta:
        model = Administrator
        fields = '__all__'
