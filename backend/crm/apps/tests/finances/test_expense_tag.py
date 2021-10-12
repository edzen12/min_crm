from django.urls import reverse
from rest_framework import status
from apps.tests.base import BaseAPITestCaseSetup
from apps.finances.models.expense_tags import ExpenseTag


class ExpenseTagAPITest(BaseAPITestCaseSetup):
    def setUp(self):
        super().setUp()
        self.expense_tag = ExpenseTag.objects.create(
            name='ExpenseTag'
        )

    def test_get_expense_tag_list_success(self):
        url = reverse('expense_tags-list')
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_get_expense_tag_detail_success(self):
        url = reverse('expense_tags-detail', kwargs={'pk': self.expense_tag.pk})
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['name'], self.expense_tag.name)

    def test_expense_tag_create_success(self):
        data = {
            'name': 'New ExpenseTag'
        }
        url = reverse('expense_tags-list')
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['name'], data['name'])

    def test_expense_tag_update_success(self):
        data = {
            'name': 'New Some ExpenseTag'
        }
        url = reverse('expense_tags-detail', kwargs={'pk': self.expense_tag.pk})
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['name'], data['name'])

    def test_expense_tag_create_fail_uniq_name(self):
        data = {
            'name': 'ExpenseTag'
        }
        url = reverse('expense_tags-list')
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertContains(
            response, 'Название категории уже существует.',
            status_code=status.HTTP_400_BAD_REQUEST)

    def test_expense_tag_delete_success(self):
        url = reverse('expense_tags-detail', kwargs={'pk': self.expense_tag.pk})
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            ExpenseTag.objects.filter(pk=self.expense_tag.pk).exists(), False)
