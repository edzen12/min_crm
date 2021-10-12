from django.urls import reverse
from rest_framework import status
from apps.tests.base import BaseAPITestCaseSetup
from apps.klasses.models import Klass
from apps.courses.models import Course
from apps.branches.models import Branch


class KlassAPITest(BaseAPITestCaseSetup):
    def setUp(self):
        super().setUp()
        self.branch = Branch.objects.create(
            name='Karakol Liceyum',
            oblast='IK',
            city='Karakol',
            address='Alamedin 1',
            email='branch@gmail.com',
            telephone_number='+996200422541',
            description='akskajfdksa'
        )
        self.course = Course.objects.create(
            title="Python",
            description="dfsdfsdf",
            status="C",
            period="9 месяцев",
            price=9000,
            program_link="https://it-academy.kg/courses/python",
            branch=self.branch
        )
        self.klass = Klass.objects.create(
            course=self.course,
            klass_id="Front-End-2",
            classroom_link="https://crmacademy.herokuapp.com/swagger/",
            branch=self.branch,
        )

    def test_get_klass_list_success(self):
        url = reverse('klasses-list')
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_get_klass_detail_success(self):
        url = reverse('klasses-detail', kwargs={'pk': self.klass.pk})
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['klass_id'], self.klass.klass_id)

    def test_klass_create_success(self):
        data = {
            "course": 1,
            "classroom_link": "http://127.0.0.1:8000/klasses/",
            "branch": 1,
            "trainers": [],
            "students": []
        }
        url = reverse('klasses-list')
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['course'], data['course'])

    def test_klass_update_success(self):
        data = {
            "course": 1,
            "classroom_link": "http://127.0.0.1:8000/klasses/",
            "branch": 1,
            "trainers": [],
            "students": []
        }
        url = reverse('klasses-detail', kwargs={'pk': self.klass.pk})
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('course'), data['course'])
        self.assertEqual(response.json().get('classroom_link'), data['classroom_link'])

    def test_klass_partial_update_success(self):
        data = {
            "classroom_link": "http://127.0.0.1:8000/klasses/",

        }
        url = reverse('klasses-detail', kwargs={'pk': self.klass.pk})
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('classroom_link'), data['classroom_link'])

    def test_klass_delete_success(self):
        url = reverse('klasses-detail', kwargs={'pk': self.klass.pk})
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Klass.objects.filter(pk=self.klass.pk).exists(), False)
