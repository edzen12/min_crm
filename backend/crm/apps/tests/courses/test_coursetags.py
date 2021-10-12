from django.urls import reverse
from rest_framework import status
from apps.tests.base import BaseAPITestCaseSetup
from apps.courses.models import CourseTag


class CourseTagAPITest(BaseAPITestCaseSetup):
    def setUp(self):
        super().setUp()
        self.tag = CourseTag.objects.create(
            title="Python",
        )

    def test_get_tag_list_success(self):
        url = reverse('course_tags-list')
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_get_tag_detail_success(self):
        url = reverse('course_tags-detail', kwargs={'pk': self.tag.pk})
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['title'], self.tag.title)

    def test_tag_create_success(self):
        data = {
            "title": "Javascript",
        }
        url = reverse('course_tags-list')
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['title'], data['title'])

    def test_tag_update_success(self):
        data = {
            'title': 'Django'
        }
        url = reverse('course_tags-detail', kwargs={'pk': self.tag.pk})
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('title'), data['title'])

    def test_tag_partial_update_success(self):
        data = {
            "title": "Javascript",
        }
        url = reverse('course_tags-detail', kwargs={'pk': self.tag.pk})
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('title'), data['title'])

    def test_tag_delete_success(self):
        url = reverse('course_tags-detail', kwargs={'pk': self.tag.pk})
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CourseTag.objects.filter(pk=self.tag.pk).exists(), False)
