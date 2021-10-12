from django.urls import reverse
from rest_framework import status
from apps.tests.base import BaseAPITestCaseSetup
from apps.clients.models import Client
from apps.branches.models import Branch


class ClientsAPITest(BaseAPITestCaseSetup):
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
        self.test_client = Client.objects.create(
            name='Test client name',
            last_name='Test client last_name',
            email='test_client@gmail.com',
            age=35,
            contacted_from='OFFICE',
            branch=self.branch,
        )

    def test_client_get_list_success(self):
        url = reverse('clients-list')
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_client_get_detail_success(self):
        url = reverse('clients-detail', kwargs={'pk': self.test_client.pk})
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['name'], self.test_client.name)

    def test_client_create_success(self):
        data = {
            "name": "Test update client name",
            "last_name": "Test update client last_name",
            "old_name": "",
            "email": "test_client_new@gmail.com",
            "age": 33,
            "telephone_number": "+996200422541",
            "contacted_from": "INSTAGRAM",
            "branch": 1,
        }
        url = reverse('clients-list')
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['name'], data['name'])

    def test_client_update_success(self):
        data = {
            "name": "Test update client name",
            "last_name": "Test update client last_name",
            "old_name": "",
            "email": "test_client_new@gmail.com",
            "age": 33,
            "telephone_number": "+996200422541",
            "contacted_from": "INSTAGRAM",
            "branch": 1,
        }
        url = reverse('clients-detail', kwargs={'pk': self.test_client.pk})
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('last_name'), data['last_name'])

    def test_client_partial_update_succecc(self):
        data = {
            "name": "Test update client name",
            "last_name": "Test udate client last_name",
            "old_name": "Test update client old_name",
            "email": "test_client_new@gmail.com",
            "age": 33,
            "telephone_number": "+996200422541",
        }
        url = reverse('clients-detail', kwargs={'pk': self.test_client.pk})
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('last_name'), data['last_name'])
        self.assertEqual(response.json().get('old_name'), data['old_name'])

    def test_client_destroy_success(self):
        url = reverse('clients-detail', kwargs={'pk': self.test_client.pk})
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Client.objects.filter(pk=self.test_client.pk).exists(), False)
