from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from apps.clients.serializers import ClientSerializer
from apps.clients.models import Client
from utils.filters import CaseInsensitiveOrderingFilter


class ClientAPIViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    filter_backends = [
        DjangoFilterBackend,
        CaseInsensitiveOrderingFilter,
        filters.SearchFilter,
    ]
    filterset_fields = [
        'test', 'came', 'obrabotan',
        'otkaz', 'paid', 'waiting',
        'contacted_from',
    ]
    ordering_fields = [
        'name', 'last_name', 'old_name',
        'email', 'age', 'telephone_number',
        'branch__name',
    ]
    ordering_case_insensitive_fields = [
        'name', 'last_name', 'old_name',
        'branch__name',
    ]
    search_fields = [
        'name', 'last_name', 'comment',
        'old_name', 'email', 'age',
        'telephone_number', 'prichina_otkaza',
        'branch__name',
    ]
