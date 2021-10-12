from rest_framework import serializers

from apps.trainers.models import Trainer
from apps.users.serializers import UserSerializer


class TrainerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    branch_name = serializers.CharField(read_only=True)

    class Meta:
        model = Trainer
        fields = '__all__'
