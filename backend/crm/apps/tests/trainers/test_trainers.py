from django.urls import reverse
from rest_framework import status
from apps.tests.base import BaseAPITestCaseSetup
from apps.users.models import User


class TrainerAPITest(BaseAPITestCaseSetup):
    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(
            email='test_trainer@example.com',
            password='test12345',
            is_trainer=True,
        )
        password = User.objects.make_random_password()
        self.user.set_password(password)
        self.user.save()
        self.trainer = self.user.trainer

    def test_get_trainer_list_success(self):
        url = reverse('trainers-list')
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_get_trainer_detail_success(self):
        url = reverse('trainers-detail', kwargs={'pk': self.trainer.pk})
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('user')['email'], self.user.email)

    def test_trainer_update_success(self):
        data = {
            "cv": None,
            "salary": "20.00",
            "contract": None,
            "passport_number": "3423412sa",
            "authority": "asdsada",
            "date_of_issue": "2020-11-06",
            "date_of_expire": "2020-11-06",
            "passport_scan": None,
            "fired": False,
            "start_work": None,
            "end_work": None,
            "end_work_cause": "",
            "is_trainer": True,
            "is_assistant": False,
            "status": "W",
            "github": None,
            "portfolio": None,
            "klasses": []
        }
        url = reverse('trainers-detail', kwargs={'pk': self.trainer.pk})
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.json().get('passport_number'),
            data['passport_number']
        )
        self.assertEqual(response.json().get('authority'), data['authority'])

    def test_trainer_partial_update_success(self):
        data = {
            "passport_number": "3423412sa",
        }
        url = reverse('trainers-detail', kwargs={'pk': self.trainer.pk})
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.json().get('passport_number'),
            data['passport_number']
        )
