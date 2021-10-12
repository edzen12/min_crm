from django.urls import reverse
from rest_framework import status
from apps.tests.base import BaseAPITestCaseSetup
from apps.users.models import User


class StaffAPITest(BaseAPITestCaseSetup):
    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(
            email='test_staff@example.com',
            password='test12345',
            is_staff_member=True,
        )
        password = User.objects.make_random_password()
        self.user.set_password(password)
        self.user.save()
        self.staff = self.user.staffmember

    def test_get_staffs_list_success(self):
        url = reverse('staffs-list')
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_get_staff_detail_success(self):
        url = reverse('staffs-detail', kwargs={'pk': self.staff.pk})
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('user')['email'], self.user.email)

    def test_staff_update_success(self):
        data = {
            "cv": None,
            "salary": "342.00",
            "contract": None,
            "passport_number": "214214392341",
            "authority": "Pkk124",
            "date_of_issue": "2020-11-06",
            "date_of_expire": "2020-11-06",
            "passport_scan": None,
            "start_work": None,
            "end_work": None,
            "end_work_cause": "",
            "is_hr": False,
            "is_sales": True,
            "is_marketing": False,
            "is_finance": False
        }
        url = reverse('staffs-detail', kwargs={'pk': self.staff.pk})
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.json().get('passport_number'),
            data['passport_number']
        )
        self.assertEqual(response.json().get('authority'), data['authority'])

    def test_staff_partial_update_success(self):
        data = {
            "passport_number": '2313123123',
        }
        url = reverse('staffs-detail', kwargs={'pk': self.staff.pk})
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.json().get('passport_number'),
            data['passport_number']
        )
