from rest_framework import viewsets

from apps.news.models import New
from apps.news import serializers

from django_filters.rest_framework import DjangoFilterBackend


class NewsViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.NewsSerializer
    filter_backends = [
        DjangoFilterBackend,
    ]
    filterset_fields = ['for_all', 'branch']

    def get_queryset(self):
        if not self.request.user.is_superuser:
            return New.objects.filter(for_all=True, branch=self.request.user.branch)
        return New.objects.all()
