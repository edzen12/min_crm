from django.urls import reverse
from rest_framework import status
from apps.tests.base import BaseAPITestCaseSetup
from apps.users.models import User


class AdministratorsAPITest(BaseAPITestCaseSetup):
    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(
            email='test_admin@example.com',
            password='test12345',
            is_administrator=True,
        )
        password = User.objects.make_random_password()
        self.user.set_password(password)
        self.user.save()
        self.admin = self.user.administrator

    def test_get_admins_list_success(self):
        url = reverse('administrators-list')
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_get_admin_detail_success(self):
        url = reverse('administrators-detail', kwargs={'pk': self.admin.pk})
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('user')['email'], self.user.email)

    def test_admin_update_success(self):
        data = {
            "cv": None,
            "salary": None,
            "contract": None,
            "passport_number": '2313123123',
            "authority": 'KPP1233',
            "date_of_issue": "2020-11-05",
            "date_of_expire": "2020-11-05",
            "passport_scan": None,
            "fired": False,
            "start_work": None,
            "end_work": None,
            "end_work_cause": ""
        }
        url = reverse('administrators-detail', kwargs={'pk': self.admin.pk})
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.json().get('passport_number'),
            data['passport_number']
        )
        self.assertEqual(response.json().get('authority'), data['authority'])

    def test_admin_partial_update_success(self):
        data = {
            "passport_number": '2313123123',
        }
        url = reverse('administrators-detail', kwargs={'pk': self.admin.pk})
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.json().get('passport_number'),
            data['passport_number']
        )
