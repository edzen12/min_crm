from django.urls import reverse
from rest_framework import status
from apps.tests.base import BaseAPITestCaseSetup
from apps.courses.models import Course
from apps.branches.models import Branch


class CourseAPITest(BaseAPITestCaseSetup):
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

    def test_get_course_list_success(self):
        url = reverse('courses-list')
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_get_course_detail_success(self):
        url = reverse('courses-detail', kwargs={'pk': self.course.pk})
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['title'], self.course.title)

    def test_course_create_success(self):
        data = {
            "title": "Some-ends",
            "description": "asdasfdasd",
            "status": "E",
            "period": "9 месяцев",
            "image": None,
            "price": "300",
            "program_link": "https://it-academy.kg/courses/python",
            "branch": 1
        }
        url = reverse('courses-list')
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['title'], data['title'])

    def test_course_update_success(self):
        data = {
            "title": "front-ends",
            "description": "asdasfdasd",
            "status": "E",
            "period": "9 месяцев",
            "image": None,
            "price": "300",
            "program_link": "https://it-academy.kg/courses/python",
            "branch": 1
        }
        url = reverse('courses-detail', kwargs={'pk': self.course.pk})
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('title'), data['title'])
        self.assertEqual(response.json().get('price'), data['price'])

    def test_course_partial_update_success(self):
        data = {
            "title": "Javascript",
            "status": "E",
            "period": "10 месяцев",

        }
        url = reverse('courses-detail', kwargs={'pk': self.course.pk})
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('title'), data['title'])

    def test_course_delete_success(self):
        url = reverse('courses-detail', kwargs={'pk': self.course.pk})
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            Course.objects.filter(pk=self.course.pk).exists(), False)
