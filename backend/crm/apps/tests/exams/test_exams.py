from django.urls import reverse
from rest_framework import status
from apps.tests.base import BaseAPITestCaseSetup
from apps.exams.models import (
    Exam, Question, QuestionAnswer
)
from apps.branches.models import Branch
from apps.courses.models import Course


class ExamAPITest(BaseAPITestCaseSetup):
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
        self.exam = Exam.objects.create(
            title="Python",
            exam_type='E',
            course=self.course
        )
        self.question = Question.objects.create(
            title='Test question',
            question_type='R',
            exam=self.exam
        )
        self.question_answer = QuestionAnswer.objects.create(
            question=self.question,
            title='Correct answer',
            is_correct=True
        )

    def test_get_exam_list_success(self):
        url = reverse('exams-list')
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_get_exam_detail_success(self):
        url = reverse('exams-detail', kwargs={'pk': self.exam.pk})
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['title'], self.exam.title)

    def test_exam_create_success(self):
        data = {
            "title": "Python",
            "exam_type": "E",
            "questions": [],
            "course": {
                "id": 1
            }
        }
        url = reverse('exams-list')
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['title'], data['title'])

    def test_exam_update_success(self):
        data = {
            "title": "IT academy",
            "exam_type": "E",
            "questions": [],
            "course": {
                "id": 1
            }
        }
        url = reverse('exams-detail', kwargs={'pk': self.exam.pk})
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('title'), data['title'])

    def test_exam_partial_update_success(self):
        data = {
            "title": "Javascript",
            "course": {
                "id": 1
            }
        }
        url = reverse('exams-detail', kwargs={'pk': self.exam.pk})
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('title'), data['title'])

    def test_exam_delete_success(self):
        url = reverse('exams-detail', kwargs={'pk': self.exam.pk})
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Exam.objects.filter(pk=self.exam.pk).exists(), False)
