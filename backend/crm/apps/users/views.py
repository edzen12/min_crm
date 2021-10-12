from rest_framework import viewsets, permissions
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response

from apps.users.serializers import UserSerializer
from utils import custom_permissions

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [
    #     permissions.IsAuthenticated,
    #     custom_permissions.IsAdministrator |
    #     custom_permissions.IsOwnerOrReadOnlyForUser,
    # ]


@api_view(['GET'])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
