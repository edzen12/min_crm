from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse


@api_view(['GET'])
def api_root(request, format=None):
    response = Response({
        'courses': reverse('courses-list', request=request, format=format),
        'trainers': reverse('trainers-list', request=request, format=format),
        'students': reverse('students-list', request=request, format=format),
        'admins': reverse('administrators-list', request=request, format=format),
        'staffs': reverse('staffs-list', request=request, format=format),
        'schedules': reverse('schedules-list', request=request, format=format),
        'examinations': reverse('exams-list', request=request, format=format),
        'klasses': reverse('klasses-list', request=request, format=format),
        'clients': reverse('clients-list', request=request, format=format),
        'branches': reverse('branches-list', request=request, format=format),
    })
    return response
