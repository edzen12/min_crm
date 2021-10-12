from django.urls import reverse
from rest_framework import status
from apps.tests.base import BaseAPITestCaseSetup
from apps.users.models import User


class StudentsAPITest(BaseAPITestCaseSetup):
    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(
            email='test_student@example.com',
            password='test12345',
            is_student=True,
        )
        password = User.objects.make_random_password()
        self.user.set_password(password)
        self.user.save()
        self.student = self.user.student

    def test_get_students_list_success(self):
        url = reverse('students-list')
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_get_student_detail_success(self):
        url = reverse('students-detail', kwargs={'pk': self.student.pk})
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('user')['email'], self.user.email)

    def test_student_update_success(self):
        data = {
            "enrollment_date": "2020-11-07",
            "study_start_date": "2020-11-07",
            "finish_date": None,
            "status": "A",
            "address": None,
            "residence_address": None,
            "mother_name": None,
            "mother_phone_number": None,
            "father_name": None,
            "father_phone_number": None,
            "english_level": "I",
            "quit_reason": None,
            "residence": None,
            "passport_number": '24332523421',
            "authority": 'NKE123',
            "date_of_issue": "2020-11-07",
            "date_of_expire": "2020-11-07",
            "passport_scan": None,
            "place_of_work": None,
            "info_from": "SN",
            "contract_amount": "0.00",
            "klasses": None
        }
        url = reverse('students-detail', kwargs={'pk': self.student.pk})
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.json().get('passport_number'),
            data['passport_number']
        )
        self.assertEqual(response.json().get('authority'), data['authority'])

    def test_student_partial_update_success(self):
        data = {
            "passport_number": '2313123123',
        }
        url = reverse('students-detail', kwargs={'pk': self.student.pk})
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.json().get('passport_number'),
            data['passport_number']
        )
