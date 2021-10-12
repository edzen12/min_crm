from django.urls import reverse
from rest_framework import status
from apps.tests.base import BaseAPITestCaseSetup
from apps.branches.models import Branch


class BranchesAPITest(BaseAPITestCaseSetup):
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

    def test_branch_get_list_success(self):
        url = reverse('branches-list')
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_branch_get_detail_success(self):
        url = reverse('branches-detail', kwargs={'pk': self.branch.pk})
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['name'], self.branch.name)

    def test_branch_create_success(self):
        data = {
            "name": "Academy",
            "oblast": "BT",
            "city": "Bishkek",
            "address": "Addres",
            "email": "hguerra@smith.com",
            "telephone_number": None,
            "description": "Agent 000",
            "class9": True,
            "class10": True,
            "class11": True
        }
        url = reverse('branches-list')
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['name'], data['name'])

    def test_branch_update_success(self):
        data = {
            "name": "Karakol Academy",
            "oblast": "BT",
            "city": "Bishkek",
            "address": "Addres",
            "email": "hguerra@smith.com",
            "telephone_number": None,
            "description": "Agent 000",
            "class9": True,
            "class10": True,
            "class11": True
        }
        url = reverse('branches-detail', kwargs={'pk': self.branch.pk})
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('address'), data['address'])
        self.assertEqual(response.json().get('city'), data['city'])

    def test_branch_partial_update_success(self):
        data = {
            "name": "Karakol Academy",
            "oblast": "BT",
        }
        url = reverse('branches-detail', kwargs={'pk': self.branch.pk})
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('name'), data['name'])
        self.assertEqual(response.json().get('oblast'), data['oblast'])

    def test_branch_destroy_success(self):
        url = reverse('branches-detail', kwargs={'pk': self.branch.pk})
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            Branch.objects.filter(pk=self.branch.pk).exists(), False)
