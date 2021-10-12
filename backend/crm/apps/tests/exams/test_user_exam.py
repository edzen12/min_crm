from django.urls import reverse
from rest_framework import status
from apps.tests.base import BaseAPITestCaseSetup
from apps.exams.models import (
    UserExam, Exam,
)
from apps.users.models import User


class UserExamAPITest(BaseAPITestCaseSetup):
    def setUp(self):
        super().setUp()
        self.user = User.objects.create_user(
            email='test_exam_email@gmail.com',
            password='test12345',
        )
        self.exam = Exam.objects.create(
            title="Python",
            exam_type='E',
        )
        self.user_exam = UserExam.objects.create(
            exam=self.exam,
            email='test_exam_email@gmail.com',
            grade=0,
            checked=False,
            user=self.user,
            first_name="Exam test first_name",
            last_name='Exam test last_name',
            phone_number='+996220424212'
        )

    def test_get_user_exam_list_success(self):
        url = reverse('user-exams-list')
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_get_user_exam_detail_success(self):
        url = reverse('user-exams-detail', kwargs={'pk': self.user_exam.pk})
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['first_name'], self.user_exam.first_name)

    def test_user_exam_create_success(self):
        data = {
            "exam": 1,
            "email": "test_user_exam@gmail.com",
            "user_answers": [],
            "grade": 5,
            "checked": True,
            "first_name": "Айкокул",
            "last_name": "Karagulov",
            "phone_number": "+996220424212"
        }
        url = reverse('user-exams-list')
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['email'], data['email'])

    def test_user_exam_update_success(self):
        data = {
            "exam": 1,
            "email": "test_user_exam@gmail.com",
            "user_answers": [],
            "grade": 5,
            "checked": True,
            "first_name": "Айкокул",
            "last_name": "Karagulov",
            "phone_number": "+996220424212"
        }
        url = reverse('user-exams-detail', kwargs={'pk': self.user_exam.pk})
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['first_name'], data['first_name'])

    def test_user_exam_partial_update_success(self):
        data = {
            "grade": 5,
            "checked": True,
        }
        url = reverse('user-exams-detail', kwargs={'pk': self.user_exam.pk})
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['grade'], data['grade'])
        self.assertEqual(response.json()['checked'], data['checked'])

    def test_user_exam_delete_success(self):
        url = reverse('user-exams-detail', kwargs={'pk': self.user_exam.pk})
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            UserExam.objects.filter(pk=self.user_exam.pk).exists(), False)
