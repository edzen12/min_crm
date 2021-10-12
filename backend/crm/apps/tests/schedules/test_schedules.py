import datetime
from django.utils import timezone
from django.urls import reverse
from rest_framework import status
from apps.tests.base import BaseAPITestCaseSetup
from apps.schedules.models import Schedule
from apps.klasses.models import Klass
from apps.courses.models import Course
from apps.branches.models import Branch


class ScheduleAPITest(BaseAPITestCaseSetup):
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
        self.schedule = Schedule.objects.create(
            title='Schedule test title',
            klass=self.klass,
            day=str(datetime.date.today().strftime('%Y-%m-%d')),
            start_time=str(timezone.now().strftime('%H:%M:%s')),
            end_time=str(timezone.now().strftime('%H:%M:%s')),
            homework_link='http://127.0.0.1:8000/admin/sch/',
        )

    def test_get_schedule_list_success(self):
        url = reverse('schedules-list')
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_get_schedule_detail_success(self):
        url = reverse('schedules-detail', kwargs={'pk': self.schedule.pk})
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['title'], self.schedule.title)

    def test_schedule_create_success(self):
        data = {
            "title": "Python",
            "klass": 1,
            "day": "2020-11-27",
            "material": None,
            "start_time": "19:28:00",
            "end_time": "19:28:00",
            "homework_link": "http://127.0.0.1:8000/api/",
        }
        url = reverse('schedules-list')
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['title'], data['title'])

    def test_schedule_update_success(self):
        data = {
            "title": "Django",
            "klass": 1,
            "day": "2020-11-27",
            "material": None,
            "start_time": "19:28:00",
            "end_time": "19:28:00",
            "homework_link": "http://127.0.0.1:8000/api/",
        }
        url = reverse('schedules-detail', kwargs={'pk': self.schedule.pk})
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('title'), data['title'])

    def test_schedule_partial_update_success(self):
        data = {
            "title": "Django + ReactJS",
            "homework_link": "http://127.0.0.1:8000/api/",
        }
        url = reverse('schedules-detail', kwargs={'pk': self.schedule.pk})
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('title'), data['title'])
        self.assertEqual(response.json().get('homework_link'), data['homework_link'])

    def test_schedule_delete_success(self):
        url = reverse('schedules-detail', kwargs={'pk': self.schedule.pk})
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            Schedule.objects.filter(pk=self.schedule.pk).exists(), False)
